import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMethod } from 'src/enums/userMethod.enum';
import { CreateUserClassDTO } from 'src/usersClasses/dto/create-user-class.dto';
import { UserClass } from 'src/usersClasses/usersClasses.entity';
import { UserClassRepository } from 'src/usersClasses/usersClasses.repository';
import { Repository, getCustomRepository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './users.entity';
import { UserRepository } from './users.repository';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private repository: Repository<User>;
  private googleClient: OAuth2Client;
  private googleClientId: string;

  constructor() {
    this.repository = getCustomRepository(UserRepository);
    this.googleClientId = process.env.GOOGLE_CLIENT_ID;
    this.googleClient = new OAuth2Client(this.googleClientId);
  }

  async findOne(email: string): Promise<User> {
    const user = await this.repository.findOne({ email });
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
