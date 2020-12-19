import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, getRepository, Repository, getConnection, getCustomRepository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './users.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
    @InjectRepository(User)
    private repository: Repository<User>

    constructor(){
        this.repository = getCustomRepository(UserRepository)
    }

    async findAll(): Promise<{ users: User[]; count: number }> {
        const [users, count] = await this.repository.findAndCount() 
        return { users, count }
    }

    async create(body: CreateUserDTO): Promise<User> {
        const user = await this.repository.create(body) 
        await this.repository.save(user)
        return user
    }
}

