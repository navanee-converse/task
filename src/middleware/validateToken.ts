import { Request,NextFunction,Response } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

let secretekey = process.env.SECRETE_KEY
let err:Error = new Error()

export function verifyToken(req:Request,res:Response,next:NextFunction)
{
    try
    {
        let header = req.headers
        if((secretekey!==undefined)&&(header.authorization!==undefined))
        {
            let token = header.authorization.split(' ')[1]
            let user = jwt.verify(token,secretekey) as {id:string,name:string}  //it verify token
            
            req.user = user            
            next()
        }
        else
        {
            err.name = "TokenError"
            err.message = "No token or secrete key"
            next(err)
        }
    }
    catch(err)
    {
        next(err)
    }

}