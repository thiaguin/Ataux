import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMethod } from 'src/enums/userMethod.enum';
import { CreateUserClassDTO } from 'src/usersClasses/dto/create-user-class.dto';
import { UserClass } from 'src/usersClasses/usersClasses.entity';
import { UserClassRepository } from 'src/usersClasses/usersClasses.repository';
import { Repository, getCustomRepository, getManager } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './users.entity';
import { UserRepository } from './users.repository';
import { OAuth2Client } from 'google-auth-library';
import { UserResetPassword } from 'src/userResetPassword/userResetPassword.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { MailService } from 'src/utils/mail.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, NOT_UNIQUE } from 'src/resource/errorType.resource';
import { CodeforcesService } from 'src/codeforces/codeforces.service';
import { PaginateService } from 'src/utils/paginate.service';
import { QueryService } from 'src/utils/query.service';
import { PayloadUserDTO } from './dto/payload-user.dto';
import { UserRole } from 'src/enums/userRole.enum';

@Injectable()
export class UsersService {
    @InjectRepository(User)
    private repository: Repository<User>;
    private googleClient: OAuth2Client;
    private googleClientId: string;
    private mailService: MailService;
    private codeforceService: CodeforcesService;
    private paginateService: PaginateService;
    private queryService: QueryService;

    constructor() {
        this.repository = getCustomRepository(UserRepository);
        this.googleClientId = process.env.GOOGLE_CLIENT_ID;
        this.googleClient = new OAuth2Client(this.googleClientId);
        this.mailService = new MailService();
        this.codeforceService = new CodeforcesService();
        this.paginateService = new PaginateService();
        this.queryService = new QueryService();
    }

    getUserResetPasswordRepository(): Repository<UserResetPassword> {
        return getManager().getRepository(UserResetPassword);
    }

    async existHandle(handle: string): Promise<void> {
        await this.codeforceService.getUser(handle);
    }

    async getResetPasswordByCode(code: string): Promise<void> {
        const userResetPasswordRepository = this.getUserResetPasswordRepository();
        const userResetPassword = await userResetPasswordRepository.findOne({ where: { code, used: false } });
        const currentTime = new Date();

        if (!userResetPassword) throw new HttpException({ entity: 'UserResetPassword', type: NOT_FOUND }, 404);

        const resetPasswordLimitTime = new Date(userResetPassword.expirationTime);

        if (currentTime.getTime() > resetPasswordLimitTime.getTime()) {
            throw new HttpException({ entity: 'Expired', type: BAD_REQUEST }, 400);
        }
    }

    async findById(id: number): Promise<User> {
        const user = await this.repository.findOne({
            where: { id },
            relations: ['classes'],
        });

        if (user) {
            return user;
        }

        throw new HttpException({ entity: 'User', type: NOT_FOUND }, 404);
    }

    async findOne(email: string): Promise<User> {
        const user = await this.repository.findOne({
            where: { email },
            relations: ['classes'],
        });

        return user;
    }

    async findOneWithPassword(email: string): Promise<User> {
        const user = await this.repository.findOne({
            where: { email },
            select: ['id', 'email', 'name', 'password', 'confirmed', 'handle', 'registration', 'method', 'role'],
        });

        return user;
    }

    async findAndCountAll(query): Promise<{ data: User[]; count: number }> {
        const page = this.paginateService.getPage(query);
        const where = this.queryService.getQueryToFind(User, query);

        const [users, count] = await this.repository.findAndCount({ ...page, where, order: { id: 'ASC' } });
        return { data: users, count };
    }

    async confirmEmail(code: string): Promise<void> {
        const user = await this.repository.findOne({ where: { confirmationCode: code, confirmed: false } });

        if (!user) {
            throw new HttpException({ entity: 'User', type: NOT_FOUND }, 404);
        }

        await this.update(user.id, { confirmed: true, confirmationCode: '' });
    }

    async update(id: number, body: UpdateUserDTO): Promise<void> {
        const user = await this.findById(id);
        delete body.password;
        await this.repository.update({ id: user.id }, body);
    }

    async updateUser(id: number, body: UpdateUserDTO, loggedUser: PayloadUserDTO): Promise<void> {
        if (loggedUser.role !== UserRole.ADMIN && `${id}` !== `${loggedUser.id}`) {
            throw new HttpException({ entity: 'User', type: FORBIDDEN }, 403);
        }

        await this.update(id, body);
    }

    async create(body: CreateUserDTO): Promise<User> {
        const user = await this.findOne(body.email);

        if (!user) {
            const confirmationCode = uuidv4();
            const userObject = { ...body, method: UserMethod.LOCAL, confirmationCode };
            const newUser = await this.repository.create(userObject);
            await this.repository.save(newUser);
            await this.mailService.sendEmailConfirmation(body.email, confirmationCode);
            return newUser;
        }

        throw new HttpException({ entity: 'User', type: NOT_UNIQUE }, 409);
    }

    async resendEmailConfirmation(email: string): Promise<void> {
        const user = await this.findOne(email);
        const confirmationCode = uuidv4();

        if (!user) {
            throw new HttpException({ entity: 'User', type: NOT_FOUND }, 404);
        }

        await this.update(user.id, { confirmed: false, confirmationCode: confirmationCode });
        await this.mailService.sendEmailConfirmation(email, confirmationCode);
    }

    async createByGoogle(body: { token: string }): Promise<User> {
        const googleUser = await this.getUserGoogle(body.token);

        if (googleUser) {
            const { email, name, sub: googleId } = googleUser;
            const user = await this.findOne(email);

            if (!user) {
                const userObject = { email, name, googleId, method: UserMethod.GOOGLE, confirmed: true };
                const newUser = await this.repository.create(userObject);
                await this.repository.save(newUser);
                return newUser;
            }

            throw new HttpException({ entity: 'User', type: NOT_UNIQUE }, 409);
        }

        throw new HttpException({ entity: 'GoogleUser', type: NOT_FOUND }, 404);
    }

    async sendCodeToResetPassword(body): Promise<void> {
        const userResetPasswordRepository = this.getUserResetPasswordRepository();
        const user = await this.findOne(body.email);

        if (!user) throw new HttpException({ entity: 'User', type: NOT_FOUND }, 404);

        const userResetPassword = await userResetPasswordRepository.findOne({ where: { userId: user.id } });
        const date = new Date();

        date.setUTCHours(date.getUTCHours() + 1);

        if (userResetPassword) {
            userResetPassword.expirationTime = date.toISOString();
            userResetPassword.code = uuidv4();
            userResetPassword.used = false;
            await userResetPasswordRepository.save(userResetPassword);
            return this.mailService.sendCodeToResetPassword(user.email, userResetPassword.code);
        } else {
            const newUserResetPassword = userResetPasswordRepository.create({
                code: uuidv4(),
                expirationTime: date.toISOString(),
                userId: user.id,
                used: false,
            });
            await userResetPasswordRepository.save(newUserResetPassword);
            return await this.mailService.sendCodeToResetPassword(user.email, newUserResetPassword.code);
        }
    }

    async resetPasswordByURL(body): Promise<void> {
        const userResetPasswordRepository = this.getUserResetPasswordRepository();
        const userResetPassword = await userResetPasswordRepository.findOne({
            where: { code: body.code },
        });
        const currentTime = new Date();

        if (!userResetPassword) throw new HttpException({ entity: 'UserResetPasswordCode', type: NOT_FOUND }, 404);

        if (body.password && body.password.length >= 6) {
            const resetPasswordLimitTime = new Date(userResetPassword.expirationTime);

            if (currentTime.getTime() > resetPasswordLimitTime.getTime() || userResetPassword.used) {
                throw new HttpException({ entity: 'UserResetPassword', type: BAD_REQUEST }, 400);
            }

            const user = await this.repository.findOne({ where: { id: userResetPassword.userId } });

            user.password = body.password;
            userResetPassword.used = true;

            await getManager().transaction(async (transactionManager) => {
                await transactionManager.save(userResetPassword);
                await transactionManager.save(user);
            });
        } else {
            throw new HttpException({ entity: 'InvalidPassword', type: BAD_REQUEST }, 400);
        }
    }

    async resetPassword(id, body) {
        const user = await this.repository.findOne({
            where: { id },
            select: ['id', 'email', 'googleId', 'handle', 'method', 'name', 'password', 'registration'],
        });

        if (!user) throw new HttpException({ entity: 'User', type: NOT_FOUND }, 404);

        if (bcrypt.compareSync(body.currentPassword, user.password)) {
            user.password = body.newPassword;
            await this.repository.save(user);
        } else {
            throw new HttpException({ entity: 'WrongPassword', type: BAD_REQUEST }, 400);
        }
    }

    async getUserGoogle(token: string) {
        const ticket = await this.googleClient.verifyIdToken({
            idToken: token,
            audience: this.googleClientId,
        });

        return ticket.getPayload();
    }

    async associateUserToClass(body: CreateUserClassDTO): Promise<UserClass> {
        const userClassRepository = getCustomRepository(UserClassRepository);
        const userClass = await userClassRepository.create(body);
        await userClassRepository.save(userClass);
        return userClass;
    }

    async remove(id: number, loggedUser: PayloadUserDTO): Promise<void> {
        if (loggedUser.id === id) throw new HttpException({ entity: 'User', type: FORBIDDEN }, 403);

        const user = await this.repository.findOne({ where: { id } });

        if (!user) {
            throw new HttpException({ entity: 'User', type: NOT_FOUND }, 404);
        }

        this.repository.remove(user);
    }
}
