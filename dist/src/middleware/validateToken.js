"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let secretekey = process.env.SECRETE_KEY;
let err = new Error();
function verifyToken(req, res, next) {
    try {
        let header = req.headers;
        if ((secretekey !== undefined) && (header.authorization !== undefined)) {
            let token = header.authorization.split(' ')[1];
            let user = jsonwebtoken_1.default.verify(token, secretekey); //it verify token
            req.user = user;
            next();
        }
        else {
            err.name = "TokenError";
            err.message = "No token or secrete key";
            next(err);
        }
    }
    catch (err) {
        next(err);
    }
}
