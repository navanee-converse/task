"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminroute = void 0;
const express_1 = require("express");
const adminController_1 = require("../controller/adminController");
const bodyParser = require("body-parser");
const validateToken_1 = require("../middleware/validateToken");
exports.adminroute = (0, express_1.Router)();
exports.adminroute.use(bodyParser.json());
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /admin/signup/:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create admin account.
 *     description: Creates a new admin account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Admin account signup successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 adminId:
 *                   type: string
 *                 adminName :
 *                   type: string
 *                 content:
 *                   type: string
 */
exports.adminroute.post('/signup', adminController_1.signup);
exports.adminroute.post('/signin', adminController_1.signInAdmin);
exports.adminroute.use(validateToken_1.verifyToken);
exports.adminroute.get('/viewall', adminController_1.viewAllApplictions);
exports.adminroute.get('/downloadresume/:id', adminController_1.viewResume);
exports.adminroute.put('/changestatus', adminController_1.changeStatus);
exports.adminroute.get('/filter', adminController_1.filterUser);
exports.adminroute.put('/changepassword', adminController_1.changePassword);
