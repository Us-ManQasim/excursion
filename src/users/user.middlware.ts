import { HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";

interface DecodedPayload {
    sub: string
    role: string
    iat: number
    exp: number
}

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService, private configService: ConfigService) { }

    use(req: Request, res: Response, next: NextFunction) {

        const header = req.headers["authorization"];
        const token = header && header.split(" ")[1];
        if (!token)
            throw new HttpException('No token found, please add a token', 401)

        const decode = <DecodedPayload>this.jwtService.decode(token)
        if (!decode || decode.role === 'user')
            throw new HttpException("Invalid token or Not authorize to access this source", 401)
        next();
    }
}