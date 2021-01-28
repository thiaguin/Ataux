import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { PayloadUserDTO } from 'src/users/dto/payload-user.dto';
import { UserRole } from 'src/enums/userRole.enum';

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
    const classId = req.body?.classId || req.query?.classId;

    const [userClass] = user.userClasses.filter((uc) => uc.classId == classId);

    if (userClass?.role != UserRole.ADMIN) {
      throw new HttpException('Forbidden', 403);
    }

    next();
  }
}

@Injectable()
export class AuthorizeColaboratorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): void {
    const user = <PayloadUserDTO>req.user;
    const classId = req.body?.classId || req.query?.classId;

    const [userClass] = user.userClasses.filter((uc) => uc.classId == classId);

    const isAdmin = userClass?.role === UserRole.ADMIN;
    const isColaborator = userClass?.role === UserRole.COLABORATOR;

    if (!isAdmin && !isColaborator) {
      throw new HttpException('Forbidden', 403);
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
