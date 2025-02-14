import { Request, Response, NextFunction } from 'express';
import { hashPassword, verifyPassword } from './passwordhash';
import { Role, token, UpdateUser } from '../interface/type.interface';
import { User } from '../models/user';
import { sequelize } from '../config/dbconfig';
import { generateToken } from './token';
import { UserFile } from '../models/userfile';
import { resp } from '../interface/response';

const err = new Error();
const user = sequelize.getRepository(User);
const userfile = sequelize.getRepository(UserFile);

export const signupuser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let response: resp;

    const name: string = req.body.userName;
    let password: string = req.body.password;
    if (password.length < 6) {
      err.name = 'Validation error';
      err.message = 'Password should contain minimum length of 6 digits';
      throw err;
    }

    password = await hashPassword(password);

    const mail: string = req.body.mail;
    const fileName = req.file!.originalname;
    const resume: Buffer = req.file!.buffer;
    const role = req.body.role;

    if (!Object.values(Role).includes(role)) {
      err.name = 'InvalidRoleError';
      err.message = 'You entered an invalid job role';
      throw err;
    }

    const userData = {
      userName: name,
      password: password,
      mail: mail,
      role: role,
    };
    const result = await user.create(userData);

    const token: token = { id: result.userId, name: result.userName };
    const header = generateToken(token);

    const fileData = {
      fileName: fileName,
      resume: resume,
      user_id: result.userId,
    };

    await userfile.create(fileData);
    response = {
      success: true,
      message: 'User sign up successfully',
      data: {
        'User id': result.userId,
        'User name': result.userName,
        Role: result.role,
        Resume: fileData.fileName,
      },
    };
    res.status(201).set(header).json(response);
  } catch (err) {
    next(err);
  }
};

export const signinuser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let response: resp;
    const id = req.body.userId;
    const password = req.body.password;
    const isUser = await user.findByPk(id);
    if (isUser !== null) {
      const hashedPassword = isUser.password;
      const flag = await verifyPassword(password, hashedPassword);
      if (flag) {
        const header = generateToken({
          id: isUser.userId,
          name: isUser.userName,
        });
        response = {
          success: true,
          message: 'User sign in successfully',
          data: { Welcome: isUser.userName },
        };
        res.status(200).set(header).json(response);
      } else {
        err.name = 'InvalidPasswordError';
        err.message = 'Incorrect or invalid password';
        throw err;
      }
    } else {
      err.name = 'InvalidUserError';
      err.message = 'User not found or invalid user';
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

export const viewuserstatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let response: resp;
    const id = req.user!.id;
    const result = await user.findByPk(id);
    if (result !== null) {
      response = {
        success: true,
        message: 'Your status',
        data: { Status: result.status },
      };
      res
        .status(200)
        .set({ Authorization: `Bearer ${req.headers.authorization}` })
        .json(response);
    }
  } catch (err) {
    next(err);
  }
};

export const updateuser = async (
  req: Request<UpdateUser>,
  res: Response,
  next: NextFunction
) => {
  try {
    let response: resp;
    const id = req.user.id;
    const mail = req.body.mail;
    let password = req.body.password;

    const data: UpdateUser = {};
    if (password !== undefined) {
      password = await hashPassword(password);
      data.password = password;
    }
    if (mail !== undefined) {
      data.mail = mail;
    }

    const [count] = await user.update(data, { where: { userId: id } });

    if (count > 0) {
      response = {
        success: true,
        message: 'User details updated sucesfully',
        data: { 'Details Updated': true },
      };

      res
        .status(200)
        .set({ Authorization: `Bearer ${req.headers.authorization}` })
        .json(response);
    } else {
      err.name = 'UpdateError';
      err.message = 'Invalid id to update or invalid data';
      throw err;
    }
  } catch (err) {
    next(err);
  }
};
