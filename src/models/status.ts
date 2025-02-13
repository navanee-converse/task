import { AutoIncrement, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Sequelize, Table } from "sequelize-typescript";
import { UserStatus } from "../interface/dataTypeStructure";
import { User } from "./userDetails";

@Table({
    freezeTableName:true,
    paranoid:true,
    timestamps:false,
})
export class Status extends Model
{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    statusId!:number

    @Default(UserStatus.notViewed)
    @Column(DataType.ENUM(...Object.values(UserStatus)))
    status!:UserStatus

    @ForeignKey(()=>User)
    @Column(DataType.INTEGER)
    user_id!:number
}
