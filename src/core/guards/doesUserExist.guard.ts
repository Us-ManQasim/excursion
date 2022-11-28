import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MESSAGE_403, USER_REPOSITORY } from '../constants';
import { User } from 'src/users/users.modal';

@Injectable()
export class DoesUserExist implements CanActivate {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const userExist = await this.userRepository.findAll({ where: { email: request.body.email } });
        if (userExist.length) {
            throw new ForbiddenException(MESSAGE_403);
        }
        return true;
    }
}
