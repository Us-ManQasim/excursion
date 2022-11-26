import { IsArray, IsDateString, IsNotEmpty } from 'class-validator';

export class ExcursionDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    @IsDateString()
    readonly date: Date;

    @IsNotEmpty()
    readonly city: string;

    @IsArray()
    readonly path: number[];

    @IsNotEmpty()
    readonly description: string;
}
// - Excursion Date
// - Path (A path/route for the excursion)