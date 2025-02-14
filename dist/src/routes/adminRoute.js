"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminroute = void 0;
const express_1 = require("express");
const adminController_1 = require("../controller/adminController");
const body_parser_1 = __importDefault(require("body-parser"));
const validateToken_1 = require("../middleware/validateToken");
exports.adminroute = (0, express_1.Router)();
exports.adminroute.use(body_parser_1.default.json());
exports.adminroute.post('/signup', adminController_1.signup);
exports.adminroute.post('/signin', adminController_1.signInAdmin);
exports.adminroute.use(validateToken_1.verifyToken);
exports.adminroute.get('/viewall', adminController_1.viewAllApplictions);
exports.adminroute.get('/downloadresume/:id', adminController_1.viewResume);
exports.adminroute.put('/changestatus', adminController_1.changeStatus);
exports.adminroute.get('/filter', adminController_1.filterUser);
exports.adminroute.put('/changepassword', adminController_1.changePassword);
