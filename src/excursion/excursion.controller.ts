import {
    Body, Controller, Get, Param, Post, Query
} from '@nestjs/common';
import { ExcursionService } from './excursion.service';

@Controller('excursion')
export class ExcursionController {
    constructor(private readonly excursionService: ExcursionService) { }

    // path protected by JWT token
    @Post('/create')
    create(
        @Body('name') name: string,
        @Body('date') date: Date,
        @Body('city') city: string,
        @Body('path') path: number[],
        @Body('description') description: string
    ) {
        return this.excursionService.create({ name, date, city, path, description })
    }

    @Get('/get-all')
    findAll(
        @Query() query: {
            offset: number,
            limit: string
        }
    ) {
        return this.excursionService.findAll(query);
    }

    @Get('/filter')
    filterByPath(
        @Query() query: {
            latitude: number,
            longitude: number
        },
    ) {
        return this.excursionService.filterByCoordinates(query.latitude, query.longitude);
    }

    @Get('/filter/:city')
    getByCity(
        @Param('city') city: string,
        @Query() query: {
            currentPage: string,
            limit: string
        }
    ) {
        return this.excursionService.filterByCity(city, query?.currentPage, query?.limit)
    }
}
