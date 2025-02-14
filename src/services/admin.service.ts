import { NextFunction, Request, Response } from 'express';
import { generateId } from './adminid.generate';
import { hashPassword, verifyPassword } from './passwordhash';
import { generateToken } from './token';
import { sequelize } from '../config/dbconfig';
import { Admin } from '../models/admin';
import { resp } from '../interface/response';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { UserFile } from '../models/userfile';
import { User } from '../models/user';
import {
  FilterUser,
  Parameter,
  UpdateStatus,
  UserStatus,
} from '../interface/type.interface';
const err = new Error();
const admin = sequelize.getRepository(Admin);
const user = sequelize.getRepository(User);

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const name: string = req.body.adminName;
    let password: string = req.body.password;
    if (password.length < 6) {
      err.name = 'ValidationError';
      err.message = 'password should contain minimum 6 character';
      next(err);
    }

    const adminId: string = generateId(name);
    password = await hashPassword(password);

    const tokendata = { id: adminId, name: name };
    const header = generateToken(tokendata);

    if (header === null) {
      err.name = 'ServerError';
      err.message = 'Something went wrong';
      throw err;
    } else {
      res.set(header);
    }
    const data = { adminId: adminId, password: password, adminName: name };

    const result = await admin.create(data);
    const response: resp = {
      success: true,
      message: 'Admin signup successfully',
      data: { 'Admin Id': result.adminId, 'Admin Name': result.adminName },
    };
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let response: resp;
    const { adminId, password } = req.body;
    const isAdmin = await admin.findByPk(adminId);

    if (isAdmin !== null) {
      const flag = await verifyPassword(password, isAdmin.password); //verify password with hashed password
      if (flag) {
        const header = generateToken({
          id: isAdmin.adminId,
          name: isAdmin.adminName,
        });
        response = {
          success: true,
          message: 'Admin signup successfully',
          data: { Welcome: isAdmin.adminName },
        };
        res.set(header);
        res.status(200).json(response);
      } else {
        err.name = 'InvalidPasswordError';
        err.message = 'Invalid or incorrect password';
        throw err;
      }
    } else {
      err.name = 'InvalidIdError';
      err.message = 'AdminId not found or invalid';
      throw err;
    }
    return response;
  } catch (err) {
    next(err);
  }
};

export const viewapplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let response: resp;
    const { id } = req.user;
    const isAdmin = await admin.findByPk(id);
    if (isAdmin !== null) {
      const users = await user.findAll({
        attributes: { exclude: ['password'] },
      }); //Display all users information except password"
      const header = { Authorization: req.headers.authorization };
      response = {
        success: true,
        message: 'Fetched All Users',
        data: users,
      };
      res.set(header);
      res.status(200).json(response);
    } else {
      err.message = 'Admin not found or deleted';
      err.name = 'InvalidIdError';
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

export const viewresume = async (
  req: Request<Parameter>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const isUser = await user.findByPk(id, { include: [UserFile] });
    if (isUser !== null) {
      const tempFile = path.join(__dirname, `temp_${id}.pdf`);
      await writeFileAsync(tempFile, isUser.userFile.resume);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachement; filename="${isUser.userFile.fileName}"`
      );
      res.set({ Authorization: `Bearer ${req.headers.authorization}` });
      res.status(200);
      res.sendFile(tempFile, (err) => {
        if (err) {
          throw err;
        }
        unlinkAsync(tempFile).catch((err) => next(err));
      });
    } else {
      err.name = 'InvalidIdError';
      err.message = 'User id invalid or not found';
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

export const changepassowrd = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let response: resp;
    const id = req.user.id;
    const password: string = req.body.password;
    const hashedPassword = await hashPassword(password);
    const [isAdmin] = await admin.update(
      { password: hashedPassword },
      { where: { adminId: id } }
    );
    if (isAdmin > 0) {
      response = {
        success: true,
        message: 'Password changed successfully',
        data: { 'Is password changed': true },
      };
      res
        .status(200)
        .set({ Authorization: `Bearer ${req.headers.authorization}` })
        .json(response);
    } else {
      err.name = 'UpdateError';
      err.message = 'Invalid user id or password';
    }
  } catch (err) {
    next(err);
  }
};
export const changestatus = async (
  req: Request<null, null, null, UpdateStatus>,
  res: Response,
  next: NextFunction
) => {
  try {
    let response: resp;
    const id = req.query.id;
    const status = req.query.status;
    if (!Object.values(UserStatus).includes(status)) {
      err.name = 'InvalidStatusError';
      err.message = 'Incorrect or invalid status';
      throw err;
    } else {
      const [isUser] = await user.update(
        { status: status },
        { where: { userId: id } }
      ); //Update user or application status
      if (isUser > 0) {
        response = {
          success: true,
          message: 'Status updated successfully',
          data: { 'Is status changed': true },
        };
        res
          .status(200)
          .set({ Authorization: `Bearer ${req.headers.authorization}` })
          .json(response);
      } else {
        err.name = 'InvalidIdError';
        err.message = 'Invalid or incorrect ID';
        throw err;
      }
    }
  } catch (err) {
    next(err);
  }
};
export const filter = async (
  req: Request<null, null, null, FilterUser>,
  res: Response,
  next: NextFunction
) => {
  try {
    let response: resp;

    const { userId, userName, status } = req.query;
    const data: FilterUser = {};
    if (userId !== undefined) {
      data.userId = userId;
    }
    if (userName !== undefined) {
      data.userName = userName;
    }
    if (status !== undefined) {
      data.status = status;
    }
    const datas: any = data;
    const listOfUser = await user.findAll({ where: datas }); //filter condition with userstatus and their details
    response = {
      success: true,
      message: 'Filtered datas',
      data: listOfUser,
    };
    res
      .status(200)
      .set({ Authorization: `Bearer ${req.headers.authorization}` })
      .json(response);
  } catch (err) {
    next(err);
  }
};
