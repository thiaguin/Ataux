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

@Injectable()
export class UsersService {
    @InjectRepository(User)
    private repository: Repository<User>;
    private googleClient: OAuth2Client;
    private googleClientId: string;
    private mailService: MailService;

    constructor() {
        this.repository = getCustomRepository(UserRepository);
        this.googleClientId = process.env.GOOGLE_CLIENT_ID;
        this.googleClient = new OAuth2Client(this.googleClientId);
        this.mailService = new MailService();
    }

    getUserResetPasswordRepository(): Repository<UserResetPassword> {
        return getManager().getRepository(UserResetPassword);
    }

    async findById(id: number): Promise<User> {
        const user = await this.repository.findOne({
            where: { id },
            relations: ['classes'],
        });

        if (user) {
            return user;
        }

        throw new HttpException('NotFound', 404);
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
            select: ['id', 'email', 'name', 'password'],
        });

        return user;
    }

    async findAndCountAll(): Promise<{ users: User[]; count: number }> {
        const [users, count] = await this.repository.findAndCount();
        return { users, count };
    }

    async create(body: CreateUserDTO): Promise<User> {
        const user = await this.findOne(body.email);

        if (!user) {
            const userObject = { ...body, method: UserMethod.LOCAL };
            const newUser = await this.repository.create(userObject);
            await this.repository.save(newUser);
            return newUser;
        }

        throw new HttpException('NotUnique', 409);
    }

    async createByGoogle(body: { token: string }): Promise<User> {
        const googleUser = await this.getUserGoogle(body.token);

        if (googleUser) {
            const { email, name, sub: googleId } = googleUser;
            const user = await this.findOne(email);

            if (!user) {
                const userObject = { email, name, googleId, method: UserMethod.GOOGLE };
                const newUser = await this.repository.create(userObject);
                await this.repository.save(newUser);
                return newUser;
            }

            throw new HttpException('NotUnique', 409);
        }

        throw new HttpException('NotFound', 404);
    }

    async setCodeToResetPassord(body): Promise<void> {
        const userResetPasswordRepository = this.getUserResetPasswordRepository();
        const user = await this.findOne(body.email);

        if (!user) throw new HttpException('NotFound', 404);

        const userResetPassword = await userResetPasswordRepository.findOne({ where: { id: user.id } });
        const date = new Date();

        date.setUTCHours(date.getUTCHours() + 1);

        if (userResetPassword) {
            userResetPassword.expirationTime = date.toISOString();
            userResetPassword.code = uuidv4();
            await userResetPasswordRepository.save(userResetPassword);
            return this.mailService.sendCodeToResetPassword(user.email, userResetPassword.code);
        } else {
            const newUserResetPassword = userResetPasswordRepository.create({
                code: uuidv4(),
                expirationTime: date.toISOString(),
                userId: user.id,
            });
            await userResetPasswordRepository.save(newUserResetPassword);
            return await this.mailService.sendCodeToResetPassword(user.email, newUserResetPassword.code);
        }
    }

    async resetPasswordByURL(body): Promise<void> {
        const userResetPasswordRepository = this.getUserResetPasswordRepository();
        const userResetPassword = await userResetPasswordRepository.findOne({ where: { code: body.code } });
        const currentTime = new Date();

        if (userResetPassword && body.password) {
            const resetPasswordLimitTime = new Date(userResetPassword.expirationTime);

            if (currentTime.getTime() > resetPasswordLimitTime.getTime()) {
                throw new HttpException('BadRequest', 400);
            }

            const user = await this.repository.findOne({ where: { id: userResetPassword.userId } });
            user.password = body.password;

            await this.repository.save(user);
        } else {
            throw new HttpException('BadRequest', 400);
        }
    }

    async resetPassword(id, body) {
        const user = await this.repository.findOne({
            where: { id },
            select: ['id', 'email', 'googleId', 'handle', 'method', 'name', 'password', 'registration'],
        });

        if (!user) throw new HttpException('NotFound', 404);

        if (bcrypt.compareSync(body.currentPassword, user.password)) {
            user.password = body.newPassword;
            await this.repository.save(user);
        } else {
            throw new HttpException('BadRequest', 400);
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
}
