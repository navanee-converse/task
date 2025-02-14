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

adminroute.post('/create', signup);

adminroute.post('/sign-in', signInAdmin);

adminroute.use(verifyToken);

adminroute.get('/view', viewAllApplictions);

adminroute.get('/view-resume/:id', viewResume);

adminroute.put('/change-status', changeStatus);

adminroute.get('/filter', filterUser);

adminroute.put('/update', changePassword);
