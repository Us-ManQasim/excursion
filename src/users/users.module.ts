import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';

@Module({
    imports: [JwtModule.register({})],
    controllers: [UsersController],
    providers: [UsersService, ...usersProviders]
})
export class UsersModule { }