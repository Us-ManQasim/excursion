import { Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { v4 as UUIDV4 } from "uuid";

@Table
export class User extends Model<User> {

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,

    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;



    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    token: string
}

    // @Column({
    //     allowNull: true
    // })
    // @PrimaryKey
    // @Default(UUIDV4)
    // id: string;

    // @Column({
    //     type: DataType.BOOLEAN,
    //     allowNull: true
    // })
    // @Default(false)
    // isAdmin: string;