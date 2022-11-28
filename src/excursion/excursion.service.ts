import { Inject, Injectable } from "@nestjs/common";
import { Op, Sequelize } from "sequelize";
import { EXCURSION_REPOSITORY } from "src/core/constants";
import { ExcursionDto } from "./dto/excursion.dto";
import { Excursion } from "./excursion.modal";

@Injectable()
export class ExcursionService {
    constructor(@Inject(EXCURSION_REPOSITORY) private readonly excursionRepository: typeof Excursion) { }

    async create(excursion: ExcursionDto) {
        const { name, date, city, path, description } = excursion;
        const point = { type: 'Point', coordinates: path };
        return await this.excursionRepository.create<Excursion>({ name, date, city, path: point, description });
    }

    async findAll(query) {
        const { limit, offset } = await this.getPagination(this.excursionRepository, query.offset, query.limit);
        const NOW = new Date();
        return await this.excursionRepository.findAll({
            order: [["createdAt", "desc"]],
            limit,
            offset,
            where: {
                date: {
                    [Op.gte]: NOW
                },
            }
        });
    }

    async filterByCity(city, _offset, _limit) {
        const { offset, limit } = await this.getPagination(this.excursionRepository, _offset, _limit);
        const NOW = new Date();
        return await this.excursionRepository.findAll({
            order: [["createdAt", "desc"]],
            limit,
            offset,
            where: {
                city,
                date: {
                    [Op.gt]: NOW
                },
            }
        })
    }

    async filterByCoordinates(longitude, latitude) {
        return await this.excursionRepository.findAll({
            where: Sequelize.where(
                Sequelize.fn('ST_DWithin',
                    Sequelize.col('path'),
                    Sequelize.fn('ST_SetSRID',
                        Sequelize.fn('ST_MakePoint',
                            longitude, latitude),
                        4326),
                    0.8), // Query to find all within 0.016 deg which is approximately 1 mile. 0.8 = 50miles approx
                true)
        });
    }

    private async getPagination(model, _offset, _limit): Promise<{ limit: number, offset: number }> {
        const page = _offset ? parseInt(_offset) : 1;
        const total = await model.count();
        const limit = _limit ? parseInt(_limit) : parseInt(total);
        const offset = (page - 1) * limit;
        return {
            limit,
            offset,
        };
    };
}

