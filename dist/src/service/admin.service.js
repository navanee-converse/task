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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = exports.changestatus = exports.changepassowrd = exports.viewresume = exports.viewapplications = exports.signin = exports.create = void 0;
const adminIdGenerate_1 = require("./adminIdGenerate");
const passwordhash_1 = require("./passwordhash");
const token_1 = require("./token");
const dbconfig_1 = require("../config/dbconfig");
const admin_1 = require("../models/admin");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const userfile_1 = require("../models/userfile");
const user_1 = require("../models/user");
const dataTypeStructure_1 = require("../interface/dataTypeStructure");
const err = new Error();
const admin = dbconfig_1.sequelize.getRepository(admin_1.Admin);
const user = dbconfig_1.sequelize.getRepository(user_1.User);
const writeFileAsync = (0, util_1.promisify)(fs_1.default.writeFile);
const unlinkAsync = (0, util_1.promisify)(fs_1.default.unlink);
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.body.adminName;
        let password = req.body.password;
        if (password.length < 6) {
            err.name = "ValidationError";
            err.message = "password should contain minimum 6 character";
            next(err);
        }
        const adminId = (0, adminIdGenerate_1.generateId)(name);
        password = yield (0, passwordhash_1.hashPassword)(password);
        const tokendata = { id: adminId, name: name };
        const header = (0, token_1.generateToken)(tokendata);
        if (header === null) {
            err.name = "ServerError";
            err.message = "Something went wrong";
            throw err;
        }
        else {
            res.set(header);
        }
        const data = { adminId: adminId, password: password, adminName: name };
        const result = yield admin.create(data);
        let response = {
            success: true,
            message: "Admin signup successfully",
            data: { "Admin Id": result.adminId, "Admin Name": result.adminName }
        };
        res.status(200).json(response);
    }
    catch (err) {
        next(err);
    }
});
exports.create = create;
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response;
        const { adminId, password } = req.body;
        const isAdmin = yield admin.findByPk(adminId);
        if (isAdmin !== null) {
            const flag = yield (0, passwordhash_1.verifyPassword)(password, isAdmin.password); //verify password with hashed password
            if (flag) {
                const header = (0, token_1.generateToken)({ id: isAdmin.adminId, name: isAdmin.adminName });
                response = {
                    success: true,
                    message: "Admin signup successfully",
                    data: { "Welcome": isAdmin.adminName }
                };
                res.set(header);
                res.status(200).json(response);
            }
            else {
                err.name = "InvalidPasswordError";
                err.message = "Invalid or incorrect password";
                throw err;
            }
        }
        else {
            err.name = "InvalidIdError";
            err.message = "AdminId not found or invalid";
            throw err;
        }
        return response;
    }
    catch (err) {
        next(err);
    }
});
exports.signin = signin;
const viewapplications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response;
        const { id } = req.user;
        const isAdmin = yield admin.findByPk(id);
        if (isAdmin !== null) {
            const users = yield user.findAll({ attributes: { exclude: ["password"] } }); //Display all users information except password"
            const header = { "Authorization": req.headers.authorization };
            response = {
                success: true,
                message: "Fetched All Users",
                data: users
            };
            res.set(header);
            res.status(200).json(response);
        }
        else {
            err.message = "Admin not found or deleted";
            err.name = "InvalidIdError";
            throw err;
        }
    }
    catch (err) {
        next(err);
    }
});
exports.viewapplications = viewapplications;
const viewresume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const isUser = yield user.findByPk(id, { include: [userfile_1.UserFile] });
        if (isUser !== null) {
            const tempFile = path_1.default.join(__dirname, `temp_${id}.pdf`);
            yield writeFileAsync(tempFile, isUser.userFile.resume);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachement; filename="${isUser.userFile.fileName}"`);
            res.set({ "Authorization": `Bearer ${req.headers.authorization}` });
            res.status(200);
            res.sendFile(tempFile, (err) => {
                if (err) {
                    throw err;
                }
                unlinkAsync(tempFile).catch((err) => next(err));
            });
        }
        else {
            err.name = "InvalidIdError";
            err.message = "User id invalid or not found";
            throw err;
        }
    }
    catch (err) {
        next(err);
    }
});
exports.viewresume = viewresume;
const changepassowrd = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response;
        const id = req.user.id;
        const password = req.body.password;
        const hashedPassword = yield (0, passwordhash_1.hashPassword)(password);
        const [isAdmin] = yield admin.update({ password: hashedPassword }, { where: { adminId: id } });
        if (isAdmin > 0) {
            response = {
                success: true,
                message: "Password changed successfully",
                data: { "Is password changed": true }
            };
            res.status(200).set({ "Authorization": `Bearer ${req.headers.authorization}` }).json(response);
        }
        else {
            err.name = "UpdateError";
            err.message = "Invalid user id or password";
        }
    }
    catch (err) {
        next(err);
    }
});
exports.changepassowrd = changepassowrd;
const changestatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response;
        const id = req.query.id;
        const status = req.query.status;
        if (!Object.values(dataTypeStructure_1.UserStatus).includes(status)) {
            err.name = "InvalidStatusError";
            err.message = "Incorrect or invalid status";
            throw err;
        }
        else {
            const [isUser] = yield user.update({ status: status }, { where: { userId: id } }); //Update user or application status
            if (isUser > 0) {
                response = {
                    success: true,
                    message: "Status updated successfully",
                    data: { "Is status changed": true }
                };
                res.status(200).set({ "Authorization": `Bearer ${req.headers.authorization}` }).json(response);
            }
            else {
                err.name = "InvalidIdError";
                err.message = "Invalid or incorrect ID";
            }
        }
    }
    catch (err) {
        next(err);
    }
});
exports.changestatus = changestatus;
const filter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response;
        const { userId, userName, status } = req.query;
        const data = {};
        if (userId !== undefined) {
            data.userId = userId;
        }
        if (userName !== undefined) {
            data.userName = userName;
        }
        if (status !== undefined) {
            data.status = status;
        }
        const datas = data;
        const listOfUser = yield user.findAll({ where: datas }); //filter condition with userstatus and their details
        response = {
            success: true,
            message: "Filtered datas",
            data: listOfUser
        };
        res.status(200).set({ "Authorization": `Bearer ${req.headers.authorization}` }).json(response);
    }
    catch (err) {
        next(err);
    }
});
exports.filter = filter;
