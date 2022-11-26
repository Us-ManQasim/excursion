import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export class Excursion extends Model<Excursion> {
    @PrimaryKey
    @Column({
        type: DataType.STRING, defaultValue: Math.floor(Math.random() * 1000000),
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    date: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    city: string;

    @Column({
        type: DataType.GEOMETRY('POINT'),
        allowNull: false,
    })
    path: object;

    @Column({
        type: DataType.STRING
    })
    description: string
}