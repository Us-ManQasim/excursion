import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';
import { SignInResponse, UsersService } from './users.service';
import { UserObj } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }


    @Post('/sign-in')
    signIn(@Body('email') email: string, @Body('password') password: string): Promise<SignInResponse> {
        return this.usersService.signIn({ email, password });
    }

    @Post('/sign-up')
    signUp(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        return this.usersService.create({ name, email, password })
    }


    @Get('/get-users')
    getAllUsers() {
        console.log('Congratulations you are authorized person for this job')
        return this.usersService.getAllUsers()
    }
}