import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt'
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async register(registerDto: RegisterDto) {

        //   0. Check if the user already exists
        const existingUser = await this.userService.findByEmail(registerDto.email)
        if (existingUser) {
            throw new ConflictException('User already exists, try logging in!');
        }

        //    1. Hash the password
        const hashedPassword = await bcrypt.hash(registerDto.password, 10)


        //    2. Create user in database
        const user = await this.userService.create({
            email: registerDto.email,
            password: hashedPassword,
            name: registerDto.name,
        })

        //    3. Generate JWT token
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        })
        //    4. Return token to client
        return {
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        }
    }

    async login(loginDto: LoginDto) {
        // 1. Find user by email, check for existance, throw error if user not present
        const user = await this.userService.findByEmail(loginDto.email)

        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }

        // 2. Compare passwords
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password)

        // 3. If no match → throw error
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials')
        }

        // 4. If match → return JWT 
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        })

        return {
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        }
    }

}
