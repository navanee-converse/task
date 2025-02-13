"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const admin_1 = require("../models/admin");
const userDetails_1 = require("../models/userDetails");
const userFiles_1 = require("../models/userFiles");
const status_1 = require("../models/status");
dotenv_1.default.config();
const host = process.env.HOST;
const user = process.env.USER;
const db = process.env.DB;
const password = process.env.PASSWORD;
exports.sequelize = new sequelize_typescript_1.Sequelize({
    host: host,
    username: user,
    password: password,
    database: db,
    dialect: "mysql",
    logging: false,
    models: [admin_1.Admin, userDetails_1.User, userFiles_1.UserFile, status_1.Status]
});
