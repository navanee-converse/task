import { Request,Response,NextFunction } from "express";
import { generateId } from "../service/adminIdGenerate";
import { Admin } from "../models/admin";
import { hashPassword, verifyPassword } from "../service/passwordhash";
import { response } from "../interface/response";
import { generateToken } from "../service/token";
import { User } from "../models/userDetails";
import { UserFile } from "../models/userFiles";
import { FilterUser, Parameter, UpdateStatus, UserStatus } from "../interface/dataTypeStructure";
import fs from "fs"
import path from "path"
import {promisify} from "util"
import { Status } from "../models/status";
import { sequelize } from "../config/dbconfig";

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

let admin = sequelize.getRepository(Admin)
let userStatus = sequelize.getRepository(Status)
let user = sequelize.getRepository(User)
let err = new Error()
export async function signup(req:Request,res:Response,next:NextFunction)
{
    try
    {                               
        let name:string = req.body.adminName
        let password:string = req.body.password
        if(password.length<6)
        {
            err.name = "ValidationError"
            err.message = "password should contain minimum 6 character"
            throw err
        }
        
        let adminId:string = generateId(name)
        password = await hashPassword(password)
        
        let token = {id:adminId,name:name}
        let header = generateToken(token)
        
        if(header!==null)
        {
            let data = {adminId:adminId,password:password,adminName:name}
    
            let result = await admin.create(data)
        
            response.data = {"AdminId":result.adminId,"Admin Name":result.adminName}
            response.message = "Admin account added successfully"
            res.status(202).set(header).json(response)
        }
        else
        {
            err.name = "ServerError"
            err.message = "Something went wrong"
        }
    }catch(err)
    {
        next(err)
    }
}

export async function signInAdmin(req:Request,res:Response,next:NextFunction)
{
    let {adminId,password} = req.body
   
    let isAdmin = await admin.findByPk(adminId)
    try
    {
        if(isAdmin!==null)  
            {
                let flag = await verifyPassword(password,isAdmin.password)   //verify password with hashed password
                if(flag)
                {
                    let header = generateToken({id:isAdmin.adminId,name:isAdmin.adminName})
                    response.message = "Login Successfull"
                    response.data = {"Welcome":isAdmin.adminName}
                    res.status(200).set(header).json(response)
                }
                else
                {
                    err.name ="InvalidPasswordError"
                    err.message = "Invalid or incorrect password"
                    throw err 
                }
            }
            else
            {
                err.name ="InvalidIdError"
                err.message = "AdminId not found or invalid"
                throw err 
            }
    }
    catch(err)
    {
        next(err)
    }
}

export async function viewAllApplictions(req:Request,res:Response,next:NextFunction)
{
    try
    {
        let {id} = req.user
        let isAdmin = await admin.findByPk(id)
        if(isAdmin!==null)
        {
            let users = await user.findAll({attributes:{exclude:["password"]}})     //Display all users information except password
            response.data = users
            response.message = "Fetched All Users"

            let header = {"Authorization":req.headers.authorization}
            res.status(200).set(header).json(response)
        }
        else
        {
            err.message = "Admin not found or deleted"
            err.name = "InvalidIdError"
            throw err
        }
    }
    catch(err)
    {
        next(err)
    }
}

export async function viewResume(req:Request<Parameter>,res:Response,next:NextFunction)
{
    try
    {
        let id = req.params.id
        let isUser = await user.findByPk(id,{include:[UserFile]})
        if(isUser!==null)
        {
            let tempFile = path.join(__dirname,`temp_${id}.pdf`)
            await writeFileAsync(tempFile, isUser.userFile.resume);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachement; filename="${isUser.userFile.fileName}"`);
            res.set({"Authorization":`Bearer ${req.headers.authorization}`})
            res.status(200)
            res.sendFile(tempFile,(err)=>{
                if(err)
                {
                    throw err
                }
                unlinkAsync(tempFile).catch((err)=>next(err))
            })
        }
        else
        {
            err.name = "InvalidIdError"
            err.message = "User id invalid or not found"
            throw err
        }

    }
    catch(err)
    {
        next(err)
    }
}

export async function changeStatus(req:Request<{},{},{},UpdateStatus>,res:Response,next:NextFunction) 
{
    try
    {
        let id = req.query.id
        let status = req.query.status
        if(!Object.values(UserStatus).includes(status))
        {
            err.name = "InvalidStatusError"
            err.message = "Incorrect or invalid status"
            throw err
        }
        else
        {
            let [isUser] = await userStatus.update({status:status},{where:{user_id:id}})    //Update user or application status
            if(isUser>0)
            {
                response.data = {"UpdatedStatus":status}
                response.message="User status updated successfully"
                res.status(200).set({"Authorization":`Bearer ${req.headers.authorization}`}).json(response)
            }
            else
            {
                err.name = "InvalidIdError"
                err.message = "Invalid or incorrect ID"
            }
        }
          
    }
    catch(err)
    {
        next(err)
    }
}

export async function filterUser(req:Request<{},{},{},FilterUser>,res:Response,next:NextFunction)
{
    try
    {
        let {userId,userName,status} = req.query
        let checkStatus1 = {}
        let data:FilterUser = {}
        if(userId!==undefined)
        {
            data.userId = userId
        }
        if(userName!==undefined)
        {
            data.userName = userName
        }
        if(status!==undefined)
        {
            checkStatus1 = {status:status}
        }
        let datas:any = data
        let listOfUser = await user.findAll({include:[{model:userStatus,where:checkStatus1}],where:datas})  //filter condition with userstatus and their details
        response.data = listOfUser
        response.message = "User fetched based on result"
        res.status(200).set({"Authorization":`Bearer ${req.headers.authorization}`}).json(response)
    }   
    catch(err) 
    {
        next(err)
    }
}

export async function changePassword(req:Request,res:Response,next:NextFunction)
{
    try
    {
        let id = req.user.id
        let password:string = req.body.password
        let hashedPassword = await hashPassword(password)
        let [isAdmin] = await admin.update({password:hashedPassword},{where:{adminId:id}})
        if(isAdmin>0)
        {
            response.data = {"Admin details updated for id":id}
            response.message = "Admin details updated"
            res.status(200).set({"Authorization":`Bearer ${req.headers.authorization}`}).json(response)
        }
        else
        {
            err.name = "UpdateError"
            err.message = "Invalid user id or password"
        }
    }
    catch(err)
    {
        next(err)
    }
}