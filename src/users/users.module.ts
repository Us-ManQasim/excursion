import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthorizationMiddleware } from './user.middlware';

import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';

@Module({
    imports: [JwtModule.register({})],
    controllers: [UsersController],
    providers: [UsersService, ...usersProviders]
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthorizationMiddleware).forRoutes("/users/get-users")
    }
}