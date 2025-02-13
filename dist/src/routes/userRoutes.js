"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userroute = void 0;
const express_1 = require("express");
const multerconfig_1 = require("../config/multerconfig");
const userController_1 = require("../controller/userController");
const body_parser_1 = __importDefault(require("body-parser"));
const validateToken_1 = require("../middleware/validateToken");
exports.userroute = (0, express_1.Router)();
exports.userroute.use(body_parser_1.default.json());
exports.userroute.post('/signup', multerconfig_1.upload.single('resume'), userController_1.signUpUser);
exports.userroute.post('/signin', userController_1.signInUser);
exports.userroute.use(validateToken_1.verifyToken);
exports.userroute.get('/viewstatus', userController_1.viewstatus);
exports.userroute.put('/updateuser', userController_1.updateUser);
