import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserClassDTO } from 'src/usersClasses/dto/create-user-class.dto';
import { UserClass } from 'src/usersClasses/usersClasses.entity';
import { UserClassRepository } from 'src/usersClasses/usersClasses.repository';
import { Repository, getCustomRepository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './users.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private repository: Repository<User>;

  constructor() {
    this.repository = getCustomRepository(UserRepository);
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
    const user = await this.repository.create(body);
    await this.repository.save(user);
    return user;
  }

  async associateUserToClass(body: CreateUserClassDTO): Promise<UserClass> {
    const userClassRepository = getCustomRepository(UserClassRepository);
    const userClass = await userClassRepository.create(body);
    await userClassRepository.save(userClass);
    return userClass;
  }
}
