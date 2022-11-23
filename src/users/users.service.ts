import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY } from "src/core/constants";
import { UserDto } from "./dto/user.dto";
import { User } from "./users.model";

@Injectable()
export class UsersService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User) { }

    async create(user: UserDto): Promise<User> {
        return await this.userRepository.create<User>(user);
    }
}