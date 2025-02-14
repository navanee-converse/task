"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userroute = void 0;
const express_1 = require("express");
const multerconfig_1 = require("../config/multerconfig");
const usercontroller_1 = require("../controller/usercontroller");
const body_parser_1 = __importDefault(require("body-parser"));
const validateToken_1 = require("../middlewares/validateToken");
exports.userroute = (0, express_1.Router)();
exports.userroute.use(body_parser_1.default.json());
exports.userroute.post('/create', multerconfig_1.upload.single('resume'), usercontroller_1.signUpUser);
exports.userroute.post('/sign-in', usercontroller_1.signInUser);
exports.userroute.use(validateToken_1.verifyToken);
/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - User
 *     description: Get user data
 *     responses:
 *       200:
 *         description: Success
 */
exports.userroute.get('/view', usercontroller_1.viewstatus);
exports.userroute.put('/update', usercontroller_1.updateUser);
