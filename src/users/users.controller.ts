import {
    Body, Controller, Post, UseGuards
} from '@nestjs/common';
import { DoesUserExist } from 'src/core/guards/doesUserExist.guard';
import { ISignInResponse } from './interfaces/users.interfaces';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('/sign-in')
    signIn(@Body('email') email: string, @Body('password') password: string): Promise<ISignInResponse> {
        return this.usersService.signIn({ email, password });
    }

    @UseGuards(DoesUserExist)
    @Post('/sign-up')
    signUp(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        return this.usersService.create({ name, email, password })
    }
}