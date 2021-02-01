import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthResultDTO } from './dto/auth-result.dto';
import { User } from 'src/users/users.entity';
import { UserMethod } from 'src/enums/userMethod.enum';
import { IncomingHttpHeaders } from 'http';
import { PayloadUserDTO } from 'src/users/dto/payload-user.dto';

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
        const { id, email, name } = user;
        const token = this.jwtService.sign({ id, email, name });
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
                    userClasses: user.userClass,
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
                userClasses: user.userClass,
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
            throw new HttpException('InvalidPassword', 400);
        }

        throw new HttpException('NotFound', 404);
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

        throw new HttpException('NotFound', 404);
    }
}
