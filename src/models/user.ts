import {
  AutoIncrement,
  Column,
  DataType,
  HasOne,
  IsEmail,
  Length,
  Model,
  PrimaryKey,
  Table,
  Unique,
  Default,
} from 'sequelize-typescript';
import { Role, UserStatus } from '../interface/type.interface';
import { UserFile } from './userfile';

@Table({
  freezeTableName: true,
  paranoid: true,
  timestamps: false,
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  userId!: number;

  @Length({
    msg: 'Name Length should be in the length between 3 to 20',
    min: 3,
    max: 20,
  })
  @Column(DataType.STRING)
  userName!: string;

  @Column(DataType.STRING)
  password!: string;

  @Unique
  @IsEmail
  @Column(DataType.STRING)
  mail!: string;

  @Column(DataType.ENUM(...Object.values(Role)))
  role!: Role;

  @Default(UserStatus.notViewed)
  @Column(DataType.ENUM(...Object.values(UserStatus)))
  status!: UserStatus;

  @HasOne(() => UserFile, { onUpdate: 'CASCADE' })
  userFile!: UserFile;
}
