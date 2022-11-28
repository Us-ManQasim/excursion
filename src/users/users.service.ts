import { HttpException, Inject, Injectable } from "@nestjs/common";
import { compare, hash } from 'bcrypt';
import { MESSAGE_400, USER_REPOSITORY } from "src/core/constants";
import { UserDto } from "./dto/user.dto";
import { User, UserRole } from "./users.modal";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";
import { ISignInResponse, IUser } from "./interfaces/users.interfaces";

@Injectable()
export class UsersService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
        private jwtService: JwtService,
        private configService: ConfigService) { }

    async create(user: UserDto) {
        const { name, email, password } = user;
        const protectedPassword = await this.hashPassword(password);
        const query = { name, email, password: protectedPassword, userRole: UserRole.USER }
        const response = await this.userRepository.create<User>(query);
        const { token } = await this.getToken({ id: response?.dataValues?.id, email });
        return {
            ...response,
            token
        }
    }

    async signIn(params): Promise<ISignInResponse> {
        const { email, password } = params;
        const query = {
            where: {
                email
            },
        }
        const user = await this.userRepository.findOne(query)
        if (!user)
            throw new HttpException(MESSAGE_400, 400);

        const validPassword = await compare(password, user.password);
        if (!validPassword)
            throw new HttpException(MESSAGE_400, 400);

        const { token } = await this.getToken({ id: user?.dataValues?.id, email });
        return {
            token
        }
    }

    private hashPassword(password: string): Promise<string> {
        return hash(password, 10);
    }

    private async getToken(user: IUser): Promise<ISignInResponse> {
        return {
            token: await this.jwtService.signAsync(
                {
                    id: user.id,
                    sub: user.email,
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

