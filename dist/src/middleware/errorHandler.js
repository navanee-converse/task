"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    res.status(404).json({ "Error": { "Name": err.name, "Message": err.message, "Stack": err.stack } });
}
