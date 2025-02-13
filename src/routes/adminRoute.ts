import { Router } from "express";
import { changePassword, changeStatus, filterUser, signInAdmin, signup, viewAllApplictions, viewResume } from "../controller/adminController";
import bodyParser = require("body-parser");
import { verifyToken } from "../middleware/validateToken";

export const adminroute = Router()

adminroute.use(bodyParser.json())

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
adminroute.post('/signup',signup)

adminroute.post('/signin',signInAdmin)

adminroute.use(verifyToken)

adminroute.get('/viewall',viewAllApplictions)

adminroute.get('/downloadresume/:id',viewResume)

adminroute.put('/changestatus',changeStatus)



adminroute.get('/filter',filterUser)


adminroute.put('/changepassword',changePassword)
