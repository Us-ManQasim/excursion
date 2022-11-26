import { HttpException, Inject, Injectable } from "@nestjs/common";
import { compare, hash } from 'bcrypt';
import { USER_REPOSITORY } from "src/core/constants";
import { UserDto } from "./dto/user.dto";
import { User, UserRole } from "./users.model";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";


export interface UserObj {
    email: string;
    password: string;
}

export interface SignInResponse {
    token: string
}

export interface IUser {
    email: string,
    userRole: string
}

export interface ISignUpResponse {
    name: string;
    email: string;
    password: string;
    userRole: string;
    updatedAt: string;
    createdAt: string;
    token: string;
}

@Injectable()
export class UsersService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
        private jwtService: JwtService,
        private configService: ConfigService) { }

    async create(user: UserDto) {
        const { name, email, password } = user;
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUser)
            throw new HttpException('Email already registered!', 400);

        const protectedPassword = await this.hashPassword(password);
        const { token } = await this.getToken({ email, userRole: UserRole.USER });

        const response = await this.userRepository.create<User>({ name, email, password: protectedPassword, userRole: UserRole.USER });
        return {
            ...response,
            token
        }
    }

    async signIn(params: UserObj): Promise<SignInResponse> {
        // Here we check the user exist or not?
        const { email, password } = params
        const user = await this.userRepository.findOne({
            where: {
                email
            },
        })

        // If user exist create his token and store into the database and return it to the user
        if (!user)
            throw new HttpException('Invalid credentials', 400);

        const validPassword = await compare(password, user.password);
        if (!validPassword) {
            throw new HttpException('Invalid credentials', 400);
        }
        const { token } = await this.getToken({ email, userRole: UserRole.USER });
        return {
            token
        }

    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.findAll();
    }

    private hashPassword(password: string): Promise<string> {
        return hash(password, 10);
    }

    private async getToken(user: IUser): Promise<SignInResponse> {
        return {
            token: await this.jwtService.signAsync(
                {
                    sub: user.email,
                    role: user.userRole,
                },
                {
                    secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
                    expiresIn: this.configService.get<string>(
                        'JWT_ACCESS_TOKEN_EXPIRATION',
                    ),
                },
            )
        }
    }
}

