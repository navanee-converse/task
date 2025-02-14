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
exports.updateuser = exports.viewuserstatus = exports.signinuser = exports.signupuser = void 0;
const passwordhash_1 = require("./passwordhash");
const type_interface_1 = require("../interface/type.interface");
const user_1 = require("../models/user");
const dbconfig_1 = require("../config/dbconfig");
const token_1 = require("./token");
const userfile_1 = require("../models/userfile");
const err = new Error();
const user = dbconfig_1.sequelize.getRepository(user_1.User);
const userfile = dbconfig_1.sequelize.getRepository(userfile_1.UserFile);
const signupuser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response;
        const name = req.body.userName;
        let password = req.body.password;
        if (password.length < 6) {
            err.name = 'Validation error';
            err.message = 'Password should contain minimum length of 6 digits';
            throw err;
        }
        password = yield (0, passwordhash_1.hashPassword)(password);
        const mail = req.body.mail;
        const fileName = req.file.originalname;
        const resume = req.file.buffer;
        const role = req.body.role;
        if (!Object.values(type_interface_1.Role).includes(role)) {
            err.name = 'InvalidRoleError';
            err.message = 'You entered an invalid job role';
            throw err;
        }
        const userData = {
            userName: name,
            password: password,
            mail: mail,
            role: role,
        };
        const result = yield user.create(userData);
        const token = { id: result.userId, name: result.userName };
        const header = (0, token_1.generateToken)(token);
        const fileData = {
            fileName: fileName,
            resume: resume,
            user_id: result.userId,
        };
        yield userfile.create(fileData);
        response = {
            success: true,
            message: 'User sign up successfully',
            data: {
                'User id': result.userId,
                'User name': result.userName,
                Role: result.role,
                Resume: fileData.fileName,
            },
        };
        res.status(201).set(header).json(response);
    }
    catch (err) {
        next(err);
    }
});
exports.signupuser = signupuser;
const signinuser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response;
        const id = req.body.userId;
        const password = req.body.password;
        const isUser = yield user.findByPk(id);
        if (isUser !== null) {
            const hashedPassword = isUser.password;
            const flag = yield (0, passwordhash_1.verifyPassword)(password, hashedPassword);
            if (flag) {
                const header = (0, token_1.generateToken)({
                    id: isUser.userId,
                    name: isUser.userName,
                });
                response = {
                    success: true,
                    message: 'User sign in successfully',
                    data: { Welcome: isUser.userName },
                };
                res.status(200).set(header).json(response);
            }
            else {
                err.name = 'InvalidPasswordError';
                err.message = 'Incorrect or invalid password';
                throw err;
            }
        }
        else {
            err.name = 'InvalidUserError';
            err.message = 'User not found or invalid user';
            throw err;
        }
    }
    catch (err) {
        next(err);
    }
});
exports.signinuser = signinuser;
const viewuserstatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response;
        const id = req.user.id;
        const result = yield user.findByPk(id);
        if (result !== null) {
            response = {
                success: true,
                message: 'Your status',
                data: { Status: result.status },
            };
            res
                .status(200)
                .set({ Authorization: `Bearer ${req.headers.authorization}` })
                .json(response);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.viewuserstatus = viewuserstatus;
const updateuser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response;
        const id = req.user.id;
        const mail = req.body.mail;
        let password = req.body.password;
        const data = {};
        if (password !== undefined) {
            password = yield (0, passwordhash_1.hashPassword)(password);
            data.password = password;
        }
        if (mail !== undefined) {
            data.mail = mail;
        }
        const [count] = yield user.update(data, { where: { userId: id } });
        if (count > 0) {
            response = {
                success: true,
                message: 'User details updated sucesfully',
                data: { 'Details Updated': true },
            };
            res
                .status(200)
                .set({ Authorization: `Bearer ${req.headers.authorization}` })
                .json(response);
        }
        else {
            err.name = 'UpdateError';
            err.message = 'Invalid id to update or invalid data';
            throw err;
        }
    }
    catch (err) {
        next(err);
    }
});
exports.updateuser = updateuser;
