import { Router } from 'express';
import { upload } from '../config/multerconfig';
import {
  signInUser,
  signUpUser,
  updateUser,
  viewstatus,
} from '../controller/userController';
import bodyParser from 'body-parser';
import { verifyToken } from '../middlewares/validateToken';

export const userroute = Router();
userroute.use(bodyParser.json());

userroute.post('/create', upload.single('resume'), signUpUser);

userroute.post('/sign-in', signInUser);

userroute.use(verifyToken);

userroute.get('/view', viewstatus);

userroute.put('/update', updateUser);
