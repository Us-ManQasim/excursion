import {
    Body, Controller, Post
} from '@nestjs/common';
import { ExcursionService } from './excursion.service';

@Controller('excursion')
export class ExcursionController {
    constructor(private readonly excursionService: ExcursionService) { }

    // name, date, city, path, description
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
}
// "path": [
//     0.21212,
//     0.321212
// ],