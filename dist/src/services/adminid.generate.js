"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = generateId;
function generateId(name) {
    let num;
    do {
        num = Math.floor(Math.random() * 999);
    } while (num <= 100);
    const adminId = name.substring(0, 3).toUpperCase() + num;
    return adminId;
}
