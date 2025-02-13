import { Column, DataType, Model, NotNull, PrimaryKey, Table ,Length} from "sequelize-typescript";

@Table({
    freezeTableName:true,
    paranoid:true,
    timestamps:false
})
export class Admin extends Model
{
    @PrimaryKey
    @Column(DataType.STRING)
    adminId!:string;

    @NotNull
    @Column({type:DataType.STRING,
        allowNull:false
    })
    password!:string;

    @NotNull
    @Length({msg:"Name Length should be in the length between 3 to 20",min:3,max:20})
    @Column({type:DataType.STRING,
        allowNull:false
    })
    adminName!:string;
}