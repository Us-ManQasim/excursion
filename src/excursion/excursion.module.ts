import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ExcursionController } from './excursion.controller';
import { AuthorizationMiddleware } from './excursion.middleware';
import { excursionProviders } from './excursion.providers';
import { ExcursionService } from './excursion.service';

@Module({
    imports: [JwtModule.register({})],
    controllers: [ExcursionController],
    providers: [ExcursionService, ...excursionProviders]
})
export class ExcursionModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthorizationMiddleware).forRoutes("/excursion/create")
    }
}