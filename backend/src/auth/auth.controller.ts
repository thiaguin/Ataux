import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthResultDTO } from './dto/auth-result.dto';
import { AuthLoginDTO } from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
    private authService: AuthService;
    private userService: UsersService;

    constructor() {
        this.userService = new UsersService();
        this.authService = new AuthService(this.userService);
    }

    @Post('/')
    login(@Body() body: AuthLoginDTO): Promise<AuthResultDTO> {
        return this.authService.login(body);
    }

    @Post('/google')
    googleLogin(@Body() body: { token: string }): Promise<AuthResultDTO> {
        return this.authService.googleLogin(body);
    }
}
