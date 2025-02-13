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
exports.signup = signup;
exports.signInAdmin = signInAdmin;
exports.viewAllApplictions = viewAllApplictions;
exports.viewResume = viewResume;
exports.changeStatus = changeStatus;
exports.filterUser = filterUser;
exports.changePassword = changePassword;
const adminIdGenerate_1 = require("../service/adminIdGenerate");
const admin_1 = require("../models/admin");
const passwordhash_1 = require("../service/passwordhash");
const response_1 = require("../interface/response");
const token_1 = require("../service/token");
const userDetails_1 = require("../models/userDetails");
const userFiles_1 = require("../models/userFiles");
const dataTypeStructure_1 = require("../interface/dataTypeStructure");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const status_1 = require("../models/status");
const dbconfig_1 = require("../config/dbconfig");
const writeFileAsync = (0, util_1.promisify)(fs_1.default.writeFile);
const unlinkAsync = (0, util_1.promisify)(fs_1.default.unlink);
let admin = dbconfig_1.sequelize.getRepository(admin_1.Admin);
let userStatus = dbconfig_1.sequelize.getRepository(status_1.Status);
let user = dbconfig_1.sequelize.getRepository(userDetails_1.User);
let err = new Error();
function signup(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let name = req.body.adminName;
            let password = req.body.password;
            let adminId = (0, adminIdGenerate_1.generateId)(name);
            password = yield (0, passwordhash_1.hashPassword)(password);
            let token = { id: adminId, name: name };
            let header = (0, token_1.generateToken)(token);
            if (header !== null) {
                let data = { adminId: adminId, password: password, adminName: name };
                let result = yield admin.create(data);
                response_1.response.data = { "AdminId": result.adminId, "Admin Name": result.adminName };
                response_1.response.message = "Admin account added successfully";
                res.status(202).set(header).json(response_1.response);
            }
            else {
                err.name = "ServerError";
                err.message = "Something went wrong";
            }
        }
        catch (err) {
            next(err);
        }
    });
}
function signInAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { adminId, password } = req.body;
        let isAdmin = yield admin.findByPk(adminId);
        try {
            if (isAdmin !== null) {
                let flag = yield (0, passwordhash_1.verifyPassword)(password, isAdmin.password); //verify password with hashed password
                if (flag) {
                    let header = (0, token_1.generateToken)({ id: isAdmin.adminId, name: isAdmin.adminName });
                    response_1.response.message = "Login Successfull";
                    response_1.response.data = { "Welcome": isAdmin.adminName };
                    res.status(200).set(header).json(response_1.response);
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
        }
        catch (err) {
            next(err);
        }
    });
}
function viewAllApplictions(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { id } = req.user;
            let isAdmin = yield admin.findByPk(id);
            if (isAdmin !== null) {
                let users = yield user.findAll({ attributes: { exclude: ["password"] } }); //Display all users information except password
                response_1.response.data = users;
                response_1.response.message = "Fetched All Users";
                let header = { "Authorization": req.headers.authorization };
                res.status(200).set(header).json(response_1.response);
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
}
function viewResume(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let id = req.params.id;
            let isUser = yield user.findByPk(id, { include: [userFiles_1.UserFile] });
            if (isUser !== null) {
                let tempFile = path_1.default.join(__dirname, `temp_${id}.pdf`);
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
}
function changeStatus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let id = req.query.id;
            let status = req.query.status;
            if (!Object.values(dataTypeStructure_1.UserStatus).includes(status)) {
                err.name = "InvalidStatusError";
                err.message = "Incorrect or invalid status";
                throw err;
            }
            else {
                let [isUser] = yield userStatus.update({ status: status }, { where: { user_id: id } }); //Update user or application status
                if (isUser > 0) {
                    response_1.response.data = { "UpdatedStatus": status };
                    response_1.response.message = "User status updated successfully";
                    res.status(200).set({ "Authorization": `Bearer ${req.headers.authorization}` }).json(response_1.response);
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
}
function filterUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { userId, userName, status } = req.query;
            let checkStatus1 = {};
            let data = {};
            if (userId !== undefined) {
                data.userId = userId;
            }
            if (userName !== undefined) {
                data.userName = userName;
            }
            if (status !== undefined) {
                checkStatus1 = { status: status };
            }
            let datas = data;
            let listOfUser = yield user.findAll({ include: [{ model: userStatus, where: checkStatus1 }], where: datas }); //filter condition with userstatus and their details
            response_1.response.data = listOfUser;
            response_1.response.message = "User fetched based on result";
            res.status(200).set({ "Authorization": `Bearer ${req.headers.authorization}` }).json(response_1.response);
        }
        catch (err) {
            next(err);
        }
    });
}
function changePassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let id = req.user.id;
            let password = req.body.password;
            let hashedPassword = yield (0, passwordhash_1.hashPassword)(password);
            let [isAdmin] = yield admin.update({ password: hashedPassword }, { where: { adminId: id } });
            if (isAdmin > 0) {
                response_1.response.data = { "Admin details updated for id": id };
                response_1.response.message = "Admin details updated";
                res.status(200).set({ "Authorization": `Bearer ${req.headers.authorization}` }).json(response_1.response);
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
}
