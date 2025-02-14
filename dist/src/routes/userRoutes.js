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
const validateToken_1 = require("../middlewares/validateToken");
exports.userroute = (0, express_1.Router)();
exports.userroute.use(body_parser_1.default.json());
/**
 * @swagger
 * /user/create:
 *   post:
 *     tags:
 *       - User
 *     summary: Sign up a new user with resume
 *     description: This endpoint creates a new user with a file upload for resume.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: user1
 *               email:
 *                 type: string
 *                 example: user1@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: The user's resume file
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
exports.userroute.post('/create', multerconfig_1.upload.single('resume'), userController_1.signUpUser);
/**
 * @swagger
 * /user/sign-in:
 *   post:
 *     tags:
 *       - User
 *     summary: Sign in a user
 *     description: This endpoint signs in a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully signed in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
exports.userroute.post('/sign-in', userController_1.signInUser);
exports.userroute.use(validateToken_1.verifyToken);
/**
 * @swagger
 * /user/view:
 *   get:
 *     tags:
 *       - User
 *     summary: View user status
 *     description: This endpoint retrieves the current status of the user.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User status retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
exports.userroute.get('/view', userController_1.viewstatus);
/**
 * @swagger
 * /user/update:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user details
 *     description: This endpoint allows the user to update their details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newUserName
 *               email:
 *                 type: string
 *                 example: newUser@example.com
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
exports.userroute.put('/update', userController_1.updateUser);
