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
exports.signup = signup;
exports.signInAdmin = signInAdmin;
exports.viewAllApplictions = viewAllApplictions;
exports.viewResume = viewResume;
exports.changeStatus = changeStatus;
exports.filterUser = filterUser;
exports.changePassword = changePassword;
const admin_service_1 = require("../services/admin.service");
function signup(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, admin_service_1.create)(req, res, next);
    });
}
function signInAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, admin_service_1.signin)(req, res, next);
    });
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
function viewAllApplictions(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, admin_service_1.viewapplications)(req, res, next);
    });
}
function viewResume(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, admin_service_1.viewresume)(req, res, next);
    });
}
function changeStatus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, admin_service_1.changestatus)(req, res, next);
    });
}
function filterUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, admin_service_1.filter)(req, res, next);
    });
}
function changePassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, admin_service_1.changepassowrd)(req, res, next);
    });
}
