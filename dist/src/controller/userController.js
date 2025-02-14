"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpUser = signUpUser;
exports.signInUser = signInUser;
exports.viewstatus = viewstatus;
exports.updateUser = updateUser;
const user_service_1 = require("../services/user.service");
function signUpUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, user_service_1.signupuser)(req, res, next);
    });
}
function signInUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, user_service_1.signinuser)(req, res, next);
    });
}
function viewstatus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, user_service_1.viewuserstatus)(req, res, next);
    });
}
function updateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, user_service_1.updateuser)(req, res, next);
    });
}
