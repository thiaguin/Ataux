import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthResultDTO } from './dto/auth-result.dto';
import { User } from 'src/users/users.entity';
import { UserMethod } from 'src/enums/userMethod.enum';
import { IncomingHttpHeaders } from 'http';
import { PayloadUserDTO } from 'src/users/dto/payload-user.dto';
import { INVALID_PASSWORD, NOT_FOUND } from 'src/resource/errorType.resource';

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
        const { id, email, name, handle, registration } = user;
        const token = this.jwtService.sign({ id, email, name, handle, registration });
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

        throw new HttpException('Unauthorized', 401);
    }

    async login(body: any): Promise<AuthResultDTO> {
        const user = await this.userService.findOneWithPassword(body.email);

        if (user?.password) {
            if (bcrypt.compareSync(body.password, user.password)) {
                return this.getToken(user);
            }
            throw new HttpException({ entity: 'User', type: INVALID_PASSWORD }, 400);
        }

        throw new HttpException({ entity: 'User', type: NOT_FOUND }, 404);
    }

    async googleLogin(body: any): Promise<AuthResultDTO> {
        const googleUser = await this.userService.getUserGoogle(body.token);

        if (googleUser) {
            const { email, sub } = googleUser;
            const user = await this.userService.findOne(email);

            if (user?.googleId === sub && user?.method === UserMethod.GOOGLE) {
                return this.getToken(user);
            }
        }

        throw new HttpException('NOT_FOUND', 404);
    }
}
