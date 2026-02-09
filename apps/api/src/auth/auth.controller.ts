import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UsersService) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto): Promise<{ token: string }> {
        const token = await this.authService.register(createUserDto);
        return { token };
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
        const token = await this.authService.login(loginDto);
        return { token };
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async profile(@Req() req: any): Promise<{ email: string }> {
        const email: string = req.user.email;
        if (!email) {
            throw new Error('Unauthorized');
        }
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        return { email: user.email };
    }
}
