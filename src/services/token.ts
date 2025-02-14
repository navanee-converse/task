import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { header, token } from '../interface/type.interface';
dotenv.config();
const secretekey = process.env.SECRETE_KEY;

export function generateToken(data: token): header | null {
  let header: header;
  if (secretekey !== undefined) {
    const token = jwt.sign(data, secretekey, { expiresIn: '15h' });
    header = { Authorization: `Bearer ${token}` };
    return header;
  } else {
    return null;
  }
}
