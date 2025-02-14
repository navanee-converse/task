"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const outfile = './swagger-out.json';
const endpointfile = ['../routes/**/*.ts'];
// const excludeFiles = ['middleware'];
// const endpointsFiles = fs
//   .readdirSync(path.join(__dirname, 'src'))
//   .filter(file => !excludeFiles.some(exclude => file.includes(exclude)))
//   .map(file => path.join(__dirname, 'src', file, '*.ts'));
const option = {
    info: {
        title: 'Task',
        version: '1.0.0',
        description: 'Documentation for APIs'
    },
    host: 'localhost:8000',
    securityDefinitions: {
        BearerAuth: {
            type: "apiKey",
            in: "header",
            name: "Authorization"
        }
    },
    security: [{ BearerAuth: [] }],
    //   useBasicAuthenticationWithAccessCodeGrant:true
};
(0, swagger_autogen_1.default)(outfile, endpointfile, option);
