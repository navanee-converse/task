import { Router } from 'express';
import {
  changePassword,
  changeStatus,
  filterUser,
  signInAdmin,
  signup,
  viewAllApplictions,
  viewResume,
} from '../controller/adminController';
import bodyParser from 'body-parser';
import { verifyToken } from '../middlewares/validateToken';

export const adminroute = Router();

adminroute.use(bodyParser.json());
/**
 * @swagger
 * /admin/create:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create a new admin user
 *     description: This endpoint creates a new admin user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: adminUser
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Admin user created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

adminroute.post('/create', signup);
/**
 * @swagger
 * /admin/sign-in:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Sign in an admin user
 *     description: This endpoint signs in an admin user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: adminUser
 *               password:
 *                 type: string
 *                 example: password123
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

adminroute.post('/sign-in', signInAdmin);

adminroute.use(verifyToken);

/**
 * @swagger
 * /admin/view:
 *   get:
 *     tags:
 *       - Admin
 *     summary: View all applications
 *     description: This endpoint retrieves all applications submitted by users.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of applications
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

adminroute.get('/view', viewAllApplictions);
/**
 * @swagger
 * /admin/view-resume/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: View a resume by ID
 *     description: This endpoint retrieves a user's resume by their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user whose resume to view
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resume retrieved successfully
 *       404:
 *         description: Resume not found
 *       500:
 *         description: Internal server error
 */

adminroute.get('/view-resume/:id', viewResume);
/**
 * @swagger
 * /admin/change-status:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Change the status of an application
 *     description: This endpoint allows an admin to change the status of a user's application.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 example: "Approved"
 *     responses:
 *       200:
 *         description: Status changed successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */

adminroute.put('/change-status', changeStatus);
/**
 * @swagger
 * /admin/filter:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Filter users based on query parameters
 *     description: This endpoint filters users based on the specified query parameters.
 *     responses:
 *       200:
 *         description: Filtered user data
 *       500:
 *         description: Internal server error
 */

adminroute.get('/filter', filterUser);
/**
 * @swagger
 * /admin/update:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Change the admin's password
 *     description: This endpoint allows an admin to change their password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

adminroute.put('/update', changePassword);
