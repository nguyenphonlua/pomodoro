import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async create(user: CreateUserDto): Promise<User> {
        const newUser = this.userRepository.create(user);
        return await this.userRepository.save(newUser);
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email } });
    }
}
