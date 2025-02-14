import express, { Application } from "express";
import dotenv from "dotenv";
import { sequelize } from "./src/config/dbconfig";
import { adminroute } from "./src/routes/adminroutes";
import { userroute } from "./src/routes/userRoutes";
import { errorHandler } from "./src/middlewares/errorHandler";
import swaggerdoc from "swagger-jsdoc"
import swaggerUI from "swagger-ui-express"
import spec from './swagger-out.json'
dotenv.config();

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

const swaggerSpec = swaggerdoc(options);




const port = process.env.PORT || 8080;

const app: Application = express();
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(spec))

app.use('/admin',adminroute)

app.use('/user',userroute)

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

sequelize
  .sync()
  .then(async() => {
    console.log(`Connected to database`);
    await sequelize.query(process.env.QUERY!==undefined?process.env.QUERY:" ");
  })
  .catch((err) => console.log(err));

app.use(errorHandler)


app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
