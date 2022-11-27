import { Inject, Injectable } from "@nestjs/common";
import { EXCURSION_REPOSITORY } from "src/core/constants";
import { ExcursionDto } from "./dto/excursion.dto";
import { Excursion } from "./excursion.modal";

@Injectable()
export class ExcursionService {
    constructor(@Inject(EXCURSION_REPOSITORY) private readonly excursionRepository: typeof Excursion) { }

    async create(excursion: ExcursionDto) {
        const { name, date, city, path, description } = excursion;
        const point = { type: 'Point', coordinates: path };
        const response = await this.excursionRepository.create<Excursion>({ name, date, city, path: point, description });
        return response
    }

    async findAll() {
        return await this.excursionRepository.findAll();
    }

    async filterByCity(city) {
        return await this.excursionRepository.findAll({ where: city })
    }

    async filterByCoordinates({ path: foreignPath }) {
        const path = this.getCoordinates(foreignPath)
        return await this.excursionRepository.findOne({
            where: { path }
        })
    }

    private getCoordinates(path) {
        const response = JSON.parse('{"' + decodeURI(path).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
        return {
            type: 'Point',
            coordinates: [
                parseFloat(response?.latitude),
                parseFloat(response?.longitude)
            ]
        }
    }
}

