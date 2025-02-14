"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const outfile = '../../swagger-out.json';
const endpointfile = ['./app.ts'];
const option = {
    info: {
        title: 'Task',
        version: '1.0.0',
        description: 'Documentation for APIs',
    },
    host: 'localhost:8000',
    securityDefinitions: {
        BearerAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
        },
    },
    security: [{ BearerAuth: [] }],
};
(0, swagger_autogen_1.default)(outfile, endpointfile, option);
