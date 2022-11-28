import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

@Table
export class User extends Model<User> {

    @PrimaryKey
    @Column({
        type: DataType.STRING, defaultValue: Math.floor(Math.random() * 1000000),
    })
    id: String;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,

    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.ENUM(UserRole.USER, UserRole.ADMIN)
    })
    userRole: UserRole

    @Column({
        type: DataType.STRING
    })
    token: string
}