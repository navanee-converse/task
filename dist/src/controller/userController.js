"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpUser = signUpUser;
exports.signInUser = signInUser;
exports.viewstatus = viewstatus;
exports.updateUser = updateUser;
const userDetails_1 = require("../models/userDetails");
const passwordhash_1 = require("../service/passwordhash");
const dataTypeStructure_1 = require("../interface/dataTypeStructure");
const response_1 = require("../interface/response");
const userFiles_1 = require("../models/userFiles");
const token_1 = require("../service/token");
const status_1 = require("../models/status");
const dbconfig_1 = require("../config/dbconfig");
let user = dbconfig_1.sequelize.getRepository(userDetails_1.User);
let userfile = dbconfig_1.sequelize.getRepository(userFiles_1.UserFile);
let status = dbconfig_1.sequelize.getRepository(status_1.Status);
let err = new Error();
function signUpUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let name = req.body.userName;
            let password = req.body.password;
            password = yield (0, passwordhash_1.hashPassword)(password);
            let mail = req.body.mail;
            let fileName = req.file.originalname;
            let resume = req.file.buffer;
            let role = req.body.role;
            if (!Object.values(dataTypeStructure_1.Role).includes(role)) {
                err.name = "InvalidRoleError";
                err.message = "You entered an invalid job role";
                throw err;
            }
            let userData = { userName: name, password: password, mail: mail, role: role };
            let result = yield user.create(userData);
            let token = { id: result.userId, name: result.userName };
            let header = (0, token_1.generateToken)(token);
            let fileData = { fileName: fileName, resume: resume, user_id: result.userId };
            yield userfile.create(fileData);
            yield status.create({ user_id: result.userId });
            response_1.response.data = { "UserId": result.userId, "UserName": result.userName, "Applied Role": result.role };
            response_1.response.message = "Job applied successfully";
            res.status(201).set(header).json(response_1.response);
        }
        catch (err) {
            next(err);
        }
    });
}
function signInUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let id = req.body.userId;
            let password = req.body.password;
            let isUser = yield user.findByPk(id);
            if (isUser !== null) {
                let hashedPassword = isUser.password;
                let flag = yield (0, passwordhash_1.verifyPassword)(password, hashedPassword);
                if (flag) {
                    let header = (0, token_1.generateToken)({ id: isUser.userId, name: isUser.userName });
                    response_1.response.message = "Signed In Successfully";
                    response_1.response.data = { "Welcome": isUser.userName };
                    res.status(200).set(header).json(response_1.response);
                }
                else {
                    err.name = "InvalidPasswordError";
                    err.message = "Incorrect or invalid password";
                    throw err;
                }
            }
            else {
                err.name = "InvalidUserError";
                err.message = "User not found or invalid user";
                throw err;
            }
        }
        catch (err) {
            next(err);
        }
    });
}
function viewstatus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let id = req.user.id;
            let result = yield user.findByPk(id, { include: [status] });
            if (result !== null) {
                response_1.response.message = "User status fetched successfully";
                response_1.response.data = { "UserId": result.userId, "UserName": result.userName, "Status": result.userStatus.status };
                res.status(200).set({ "Authorization": `Bearer ${req.headers.authorization}` }).json(response_1.response);
            }
        }
        catch (err) {
            next(err);
        }
    });
}
function updateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let id = req.user.id;
            let mail = req.body.mail;
            let password = req.body.password;
            let data = {};
            if (password !== undefined) {
                password = yield (0, passwordhash_1.hashPassword)(password);
                data.password = password;
            }
            if (mail !== undefined) {
                data.mail = mail;
            }
            let [count] = yield user.update(data, { where: { userId: id } });
            if (count > 0) {
                response_1.response.message = "User details updated for below id";
                response_1.response.data = { "UserId": id };
                res.status(200).set({ "Authorization": `Bearer ${req.headers.authorization}` }).json(response_1.response);
            }
            else {
                err.name = "UpdateError";
                err.message = "Invalid id to update or invalid data";
                throw (err);
            }
        }
        catch (err) {
            next(err);
        }
    });
}
