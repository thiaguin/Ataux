import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { PayloadUserDTO } from 'src/users/dto/payload-user.dto';
import { UserRole } from 'src/enums/userRole.enum';
import { FORBIDDEN } from 'src/resource/errorType.resource';

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: () => void): Promise<void> {
        const userService = new UsersService();
        const authService = new AuthService(userService);
        req.user = await authService.authorize(req.headers);
        next();
    }
}

@Injectable()
export class AuthorizeMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: () => void): void {
        const user = <PayloadUserDTO>req.user;
        // const classId = req.body?.classId || req.query?.classId;

        // const [userClass] = user.userClasses.filter((uc) => uc.classId == classId);

        if (user.role != UserRole.ADMIN) {
            throw new HttpException({ enity: 'User', type: FORBIDDEN }, 403);
        }

        next();
    }
}

@Injectable()
export class AuthorizeColaboratorMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: () => void): void {
        const user = <PayloadUserDTO>req.user;
        // const classId = req.body?.classId || req.query?.classId;

        // const [userClass] = user.userClasses.filter((uc) => uc.classId == classId);

        const isAdmin = user?.role === UserRole.ADMIN;
        const isColaborator = user?.role === UserRole.COLABORATOR;

        if (!isAdmin && !isColaborator) {
            throw new HttpException({ enity: 'User', type: FORBIDDEN }, 403);
        }

        next();
    }
}

@Injectable()
export class GetUserMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: () => void): Promise<void> {
        const userService = new UsersService();
        const authService = new AuthService(userService);
        req.user = await authService.getUser(req.headers);
        next();
    }
}

@Injectable()
export class MemberQueryMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: () => void): Promise<void> {
        const user = <PayloadUserDTO>req.user;

        if (user.role === UserRole.MEMBER) req.query.userId = <any>user.id;

        next();
    }
}

@Injectable()
class RoleValidationMiddleware implements NestMiddleware {
    private alloweds: string[];

    constructor(alloweds: string[]) {
        this.alloweds = alloweds;
    }

    async use(req: Request, res: Response, next: () => void): Promise<void> {
        const loggedUser = <PayloadUserDTO>req.user;

        if (!this.alloweds.includes(loggedUser.role)) {
            throw new HttpException({ enity: 'User', type: FORBIDDEN }, 403);
        }

        next();
    }
}

@Injectable()
export class AdminValidationMiddleware extends RoleValidationMiddleware {
    constructor() {
        super([UserRole.ADMIN]);
    }
}

@Injectable()
export class PrivilegedRolesValidationMiddleware extends RoleValidationMiddleware {
    constructor() {
        super([UserRole.ADMIN, UserRole.COLABORATOR]);
    }
}
