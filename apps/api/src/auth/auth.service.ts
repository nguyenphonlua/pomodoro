import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async register(createUserDto: CreateUserDto): Promise<string> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = hashedPassword;
        const user = await this.usersService.create(createUserDto);
        const payload = { id: user.id, email: user.email };
        return this.jwtService.sign(payload);
    }

    async login(loginDto: LoginDto): Promise<string> {
        const user = await this.usersService.findUserByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { id: user.id, email: user.email };
        return this.jwtService.sign(payload);
    }

    // async getProfile(token: string) {
    //     try {
    //         const payload: { id: string, email: string } = this.jwtService.verify(token);
    //         return await this.usersService.findUserByEmail(payload.email);
    //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     } catch (error) {
    //         throw new UnauthorizedException('Invalid token');
    //     }
    // }
}
