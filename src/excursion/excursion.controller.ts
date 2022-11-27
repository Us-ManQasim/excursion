import {
    Body, Controller, Get, Param, Post
} from '@nestjs/common';
import { ExcursionService } from './excursion.service';

@Controller('excursion')
export class ExcursionController {
    constructor(private readonly excursionService: ExcursionService) { }

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
    findAll() {
        return this.excursionService.findAll();
    }

    // These filters are temporary, to check whether these are working or not?
    // have to create a single path to retrieve data by path & city,
    // Pagination isn't implemented yet.
    @Get('/filter/:path')
    filterByPath(
        @Param() params,
    ) {
        return this.excursionService.filterByCoordinates(params);
    }

    @Get('/filter/:city')
    getByCity(
        @Param('city') city: string
    ) {
        return this.excursionService.filterByCity({ city })
    }

}
