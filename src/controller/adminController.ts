import { Request, Response, NextFunction } from 'express';

import {
  FilterUser,
  Parameter,
  UpdateStatus,
} from '../interface/type.interface';

import {
  changepassowrd,
  changestatus,
  create,
  filter,
  signin,
  viewapplications,
  viewresume,
} from '../services/admin.service';

export async function signup(req: Request, res: Response, next: NextFunction) {
  await create(req, res, next);
}

export async function signInAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  await signin(req, res, next);
}
/**
 * @swagger
 * /user:
 *   get:
 *     operationId: getUserEndpoint
 *     description: Get user data
 *     responses:
 *       200:
 *         description: Success
 */
export async function viewAllApplictions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  await viewapplications(req, res, next);
}

export async function viewResume(
  req: Request<Parameter>,
  res: Response,
  next: NextFunction
) {
  await viewresume(req, res, next);
}

export async function changeStatus(
  req: Request<null, null, null, UpdateStatus>,
  res: Response,
  next: NextFunction
) {
  await changestatus(req, res, next);
}

export async function filterUser(
  req: Request<null, null, null, FilterUser>,
  res: Response,
  next: NextFunction
) {
  await filter(req, res, next);
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  await changepassowrd(req, res, next);
}
