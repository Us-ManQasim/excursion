import { HttpException, Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { USER_REPOSITORY } from "src/core/constants";
import { User } from "../users/users.model";

interface DecodedPayload {
    id: string
    sub: string
    iat: number
    exp: number
}

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User, private jwtService: JwtService, private configService: ConfigService) { }

    async use(req: Request, res: Response, next: NextFunction) {

        const header = req.headers["authorization"];
        const token = header && header.split(" ")[1];
        if (!token)
            throw new HttpException('No token found, please add a token', 401)

        const decode = <DecodedPayload>this.jwtService.decode(token)

        const existingUser = await this.userRepository.findOne({
            where: { id: decode?.id }
        });
        if (!decode || existingUser?.userRole !== 'admin')
            throw new HttpException("Authorization error.", 401)
        next();
    }
}