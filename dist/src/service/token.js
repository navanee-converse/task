"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let secretekey = process.env.SECRETE_KEY;
function generateToken(data) {
    let header;
    if (secretekey !== undefined) {
        let token = jsonwebtoken_1.default.sign(data, secretekey, { expiresIn: "15h" });
        header = { "Authorization": `Bearer ${token}` };
        return header;
    }
    else {
        return null;
    }
}
