import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { Admin } from '../models/admin';
import { User } from '../models/user';
import { UserFile } from '../models/userfile';
dotenv.config();

const host = process.env.HOST;
const user = process.env.USER;
const db = process.env.DB;
const password = process.env.PASSWORD;

export const sequelize = new Sequelize({
  host: host,
  username: user,
  password: password,
  database: db,
  dialect: 'mysql',
  logging: false,
  models: [Admin, User, UserFile],
});
