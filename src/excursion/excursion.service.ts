import { Inject, Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize";
import { EXCURSION_REPOSITORY } from "src/core/constants";
import { ExcursionDto } from "./dto/excursion.dto";
import { Excursion } from "./excursion.modal";
import { Op } from "sequelize";

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

    async filterByCity(city, userPage, recordLimit) {
        const pagination = await this.getPagination(this.excursionRepository, userPage, recordLimit);
        const NOW = new Date();


        return await this.excursionRepository.findAll({
            order: [["createdAt", "desc"]],
            limit: pagination.limit,
            offset: pagination.offset,
            where: {
                city,
                date: {
                    [Op.gt]: NOW
                },
            }
        })
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

    private async getPagination(model, userPage, userLimit) {
        const page = userPage ? parseInt(userPage) : 1;
        const total = await model.count();
        const limit = userLimit ? parseInt(userLimit) : parseInt(total);
        const offset = (page - 1) * limit;
        const nextPage = total / limit > page ? page + 1 : null;
        const prevPage = page <= 1 ? null : page - 1;
        const totalPages = Math.ceil(total / limit);
        return {
            limit,
            offset,
            nextPage,
            prevPage,
            totalRecords: total,
            totalPages,
            currentPage: page,
        };
    };
}

