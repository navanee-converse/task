import { Request, Response, NextFunction } from 'express';
import { UpdateUser } from '../interface/type.interface';
import {
  signinuser,
  signupuser,
  updateuser,
  viewuserstatus,
} from '../services/user.service';

export async function signUpUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  await signupuser(req, res, next);
}

export async function signInUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  await signinuser(req, res, next);
}

export async function viewstatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  await viewuserstatus(req, res, next);
}

export async function updateUser(
  req: Request<UpdateUser>,
  res: Response,
  next: NextFunction
) {
  await updateuser(req, res, next);
}
