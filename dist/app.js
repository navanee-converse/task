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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbconfig_1 = require("./src/config/dbconfig");
const adminroutes_1 = require("./src/routes/adminroutes");
const userRoutes_1 = require("./src/routes/userRoutes");
const errorHandler_1 = require("./src/middlewares/errorHandler");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_out_json_1 = __importDefault(require("./swagger-out.json"));
dotenv_1.default.config();
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API documentation for Admin and User operations',
    },
    servers: [
        {
            url: 'http://localhost:8000',
        },
    ],
};
const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const port = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_out_json_1.default));
app.use('/admin', adminroutes_1.adminroute);
app.use('/user', userRoutes_1.userroute);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
dbconfig_1.sequelize
    .sync()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Connected to database`);
    yield dbconfig_1.sequelize.query(process.env.QUERY !== undefined ? process.env.QUERY : " ");
}))
    .catch((err) => console.log(err));
app.use(errorHandler_1.errorHandler);
app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});
