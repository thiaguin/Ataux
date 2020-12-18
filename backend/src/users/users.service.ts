import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, getRepository, Repository, getConnection } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
    private repository: Repository<User>
    
    constructor(){
        this.repository = new Repository<User>() 
    }

    async findAll(): Promise<{ users: User[]; count: number }> {
        const repository = getManager().getRepository(User)
        const [users, count] = await repository.findAndCount() 
        return { users, count }
    }

    async create(): Promise<User> {
        const user = await this.repository.create({})
        await this.repository.save(user)
        return user
    }
}

