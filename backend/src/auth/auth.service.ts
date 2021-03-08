import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthResultDTO } from './dto/auth-result.dto';
import { User } from 'src/users/users.entity';
import { UserMethod } from 'src/enums/userMethod.enum';
import { IncomingHttpHeaders } from 'http';
import { PayloadUserDTO } from 'src/users/dto/payload-user.dto';
import { BAD_REQUEST, INVALID_PASSWORD, NOT_FOUND, UNAUTHORIZED, GOOGLE_USER } from 'src/resource/errorType.resource';

@Injectable()
export class AuthService {
    private userService: UsersService;
    private jwtService: JwtService;

    constructor(userService: UsersService) {
        this.userService = userService;
        this.jwtService = new JwtService({
            secret: process.env.SECRET,
            signOptions: { expiresIn: '24h' },
        });
    }

    getToken(user: User): { token: string } {
        const { id, email, name, handle, registration, role } = user;
        const token = this.jwtService.sign({ id, email, name, handle, registration, role });
        return { token };
    }

    async getUser(headers: IncomingHttpHeaders): Promise<PayloadUserDTO> {
        const token = headers.authorization;

        if (token) {
            const { email } = this.jwtService.verify(token);
            const user = await this.userService.findOne(email);

            if (user)
                return {
                    email,
                    id: user.id,
                    name: user.name,
                    userClasses: user.classes,
                    handle: user.handle,
                };
        }
    }

    async authorize(headers: IncomingHttpHeaders): Promise<PayloadUserDTO> {
        const token = headers.authorization;

        if (token) {
            const { email } = this.jwtService.verify(token);
            const user = await this.userService.findOne(email);

            if (!user) throw new HttpException('Forbidden', 403);

            return {
                email,
                id: user.id,
                name: user.name,
                handle: user.handle,
                userClasses: user.classes,
            };
        }

        throw new HttpException({ enity: 'User', type: UNAUTHORIZED }, 401);
    }

    async refreshToken(token: string): Promise<AuthResultDTO> {
        const payload = this.jwtService.verify(token);
        const user = await this.userService.findById(payload.id);

        return this.getToken(user);
    }

    async login(body: any): Promise<AuthResultDTO> {
        const user = await this.userService.findOneWithPassword(body.email);

        if (user?.method === UserMethod.GOOGLE) {
            throw new HttpException({ entity: 'User', type: GOOGLE_USER }, 400);
        }

        if (user?.password) {
            if (!bcrypt.compareSync(body.password, user.password)) {
                throw new HttpException({ entity: 'User', type: INVALID_PASSWORD }, 400);
            }

            if (user && !user.confirmed) {
                throw new HttpException({ entity: 'NotConfirmed', type: UNAUTHORIZED }, 401);
            }

            return this.getToken(user);
        }

        throw new HttpException({ entity: 'User', type: NOT_FOUND }, 404);
    }

    async googleLogin(body: any): Promise<AuthResultDTO> {
        const googleUser = await this.userService.getUserGoogle(body.token);

        if (googleUser) {
            const { email, sub } = googleUser;
            const user = await this.userService.findOne(email);
            if (!user) {
                const newUser = await this.userService.createByGoogle({ token: body.token });
                return this.getToken(newUser);
            }

            if (user.googleId && user.googleId === sub) {
                return this.getToken(user);
            } else if (!user.googleId) {
                await this.userService.update(user.id, { googleId: sub, confirmed: true, confirmationCode: '' });
                return this.getToken(user);
            }
        }

        throw new HttpException({ entity: 'GoogleLogin', type: BAD_REQUEST }, 400);
    }
}
