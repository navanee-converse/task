import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './user';

@Table({
  freezeTableName: true,
  paranoid: true,
  timestamps: false,
})
export class UserFile extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  fileId!: number;

  @Column(DataType.STRING)
  fileName!: string;

  @Column({
    type: DataType.BLOB('medium'),
  })
  resume!: Buffer;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id!: number;

  @BelongsTo(() => User)
  user_details!: User;
}
