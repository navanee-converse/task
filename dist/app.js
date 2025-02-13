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
const adminRoute_1 = require("./src/routes/adminRoute");
const userRoutes_1 = require("./src/routes/userRoutes");
const errorHandler_1 = require("./src/middleware/errorHandler");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_out_json_1 = __importDefault(require("./swagger-out.json"));
dotenv_1.default.config();
const port = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_out_json_1.default));
app.use('/admin', adminRoute_1.adminroute);
app.use('/user', userRoutes_1.userroute);
app.use(errorHandler_1.errorHandler);
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
