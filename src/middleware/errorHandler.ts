import {Request,Response,NextFunction} from "express"


export function errorHandler(err:Error,req:Request,res:Response,next:NextFunction)
{
  res.status(404).json({"Error":{"Name":err.name,"Message":err.message,"Stack":err.stack}})
}   

