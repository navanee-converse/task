import { Router } from "express";
import { changePassword, changeStatus, filterUser, signInAdmin, signup, viewAllApplictions, viewResume } from "../controller/adminController";
import bodyParser = require("body-parser");
import { verifyToken } from "../middleware/validateToken";

export const adminroute = Router()

adminroute.use(bodyParser.json())


adminroute.post('/signup',signup)

adminroute.post('/signin',signInAdmin)

adminroute.use(verifyToken)

adminroute.get('/viewall',viewAllApplictions)

adminroute.get('/downloadresume/:id',viewResume)

adminroute.put('/changestatus',changeStatus)



adminroute.get('/filter',filterUser)


adminroute.put('/changepassword',changePassword)
