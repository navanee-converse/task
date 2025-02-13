import { Request,Response,NextFunction } from "express";
import { User } from "../models/userDetails";
import { hashPassword, verifyPassword } from "../service/passwordhash";
import { Role, token, UpdateUser, } from "../interface/dataTypeStructure";
import { response } from "../interface/response";
import { UserFile } from "../models/userFiles";
import { generateToken } from "../service/token";
import { Status } from "../models/status";
import { sequelize } from "../config/dbconfig";
let user = sequelize.getRepository(User)
let userfile = sequelize.getRepository(UserFile)
let status = sequelize.getRepository(Status)
let err = new Error()

export async function signUpUser(req:Request,res:Response,next:NextFunction)
{
    try
    {
        let name:string = req.body.userName
        let password:string = req.body.password
       
        password = await hashPassword(password)

        let mail:string = req.body.mail
        let fileName = req.file!.originalname
        let resume:Buffer = req.file!.buffer
        let role = req.body.role        
        
        if(!Object.values(Role).includes(role))
        {
            err.name = "InvalidRoleError"
            err.message = "You entered an invalid job role"
            throw err
        }

        let userData = {userName:name,password:password,mail:mail,role:role}
        let result = await user.create(userData)

        let token:token = {id:result.userId,name:result.userName}
        let header = generateToken(token)

        let fileData = {fileName:fileName,resume:resume,user_id:result.userId}

        await userfile.create(fileData)
        await status.create({user_id:result.userId})

        response.data = {"UserId":result.userId,"UserName":result.userName,"Applied Role":result.role}
        response.message = "Job applied successfully"

        res.status(201).set(header).json(response)

    }
    catch(err)
    {
       next(err)
    }
}

export async function signInUser(req:Request,res:Response,next:NextFunction)
{
   try
   {
        let id = req.body.userId
        let password = req.body.password
        let isUser = await user.findByPk(id)
        if(isUser!==null)
        {
            let hashedPassword = isUser.password
            let flag = await verifyPassword(password,hashedPassword)
            if(flag)
            {
                let header = generateToken({id:isUser.userId,name:isUser.userName})
                response.message = "Signed In Successfully"
                response.data = {"Welcome":isUser.userName}
                res.status(200).set(header).json(response)
            }
            else
            {
                err.name = "InvalidPasswordError"
                err.message = "Incorrect or invalid password"
                throw err
            }
        }
        else
        {
            err.name = "InvalidUserError"
            err.message = "User not found or invalid user"
            throw err
        }
   }
   catch(err)
   {
        next(err)
   }
}

export async function viewstatus(req:Request,res:Response,next:NextFunction)
{
    try
    {
        
        
        let id = req.user!.id
        let result = await user.findByPk(id,{include:[status]})
        if(result!==null)
        {
            response.message = "User status fetched successfully"
            response.data ={"UserId":result.userId,"UserName":result.userName,"Status":result.userStatus.status}
            res.status(200).set({"Authorization":`Bearer ${req.headers.authorization}`}).json(response)
        }
    }
    catch(err)
    {
        next(err)
    }
}

export async function updateUser(req:Request<{},{},UpdateUser,{}>,res:Response,next:NextFunction)
{
    try
    {
        let id =  req.user.id
        let mail = req.body.mail
        let password = req.body.password

        
        let data:UpdateUser = {}
        if(password!==undefined)
        {
            password = await hashPassword(password)
            data.password = password
        }
        if(mail!==undefined)
        {
            data.mail = mail
        }
        
        let[count] = await user.update(data,{where:{userId:id}})
   
        
        if(count>0)
        {
            response.message = "User details updated for below id"
            response.data ={"UserId":id}
            res.status(200).set({"Authorization":`Bearer ${req.headers.authorization}`}).json(response)
        }
        else
        {
            err.name = "UpdateError"
            err.message = "Invalid id to update or invalid data"
            throw(err)
        }
    
    }
    catch(err)
    {
        next(err)
    }
}
