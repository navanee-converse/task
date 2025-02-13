import { Router } from "express";
import { upload } from "../config/multerconfig";
import { signInUser, signUpUser, updateUser, viewstatus } from "../controller/userController";
import bodyParser from "body-parser";
import { verifyToken } from "../middleware/validateToken";

export const userroute  = Router()
userroute.use(bodyParser.json())

userroute.post('/signup',upload.single('resume'),signUpUser)

userroute.post('/signin',signInUser)

userroute.use(verifyToken)

userroute.get('/viewstatus',viewstatus)

userroute.put('/updateuser',updateUser)