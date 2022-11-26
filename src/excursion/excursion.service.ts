import { Inject, Injectable } from "@nestjs/common";
import { EXCURSION_REPOSITORY } from "src/core/constants";
import { ExcursionDto } from "./dto/excursion.dto";
import { Excursion } from "./excursion.modal";


export interface UserObj {
    email: string;
    password: string;
}

export interface SignInResponse {
    token: string
}

export interface IUser {
    id: String,
    email: string,
}

export interface ISignUpResponse {
    name: string;
    email: string;
    password: string;
    userRole: string;
    updatedAt: string;
    createdAt: string;
    token: string;
}

@Injectable()
export class ExcursionService {
    constructor(@Inject(EXCURSION_REPOSITORY) private readonly excursionRepository: typeof Excursion) { }

    async create(excursion: ExcursionDto) {
        const { name, date, city, path, description } = excursion;

        const point = { type: 'Point', coordinates: path };
        const response = await this.excursionRepository.create<Excursion>({ name, date, city, path: point, description });
        return response
    }
}

