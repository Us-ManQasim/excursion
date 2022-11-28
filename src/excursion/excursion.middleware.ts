import { HttpException, Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { MESSAGE_401, MESSAGE_NO_TOKEN, USER_REPOSITORY } from "src/core/constants";
import { User } from "../users/users.modal";
import { IDecodedPayload } from "./interfaces/excursion.interfaces";

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User, private jwtService: JwtService, private configService: ConfigService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const header = req.headers["authorization"];
        const token = header && header.split(" ")[1];
        if (!token)
            throw new HttpException(MESSAGE_NO_TOKEN, 401)

        const decode = <IDecodedPayload>this.jwtService.decode(token)
        const query = {
            where: { id: decode?.id }
        }
        const existingUser = await this.userRepository.findOne(query);

        if (!decode || existingUser?.userRole !== 'admin')
            throw new HttpException(MESSAGE_401, 401)

        next();
    }
}