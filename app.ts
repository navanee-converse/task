import express, { Application } from "express";
import dotenv from "dotenv";
import { sequelize } from "./src/config/dbconfig";
import { adminroute } from "./src/routes/adminRoute";
import { userroute } from "./src/routes/userRoutes";
import { errorHandler } from "./src/middleware/errorHandler";
import swaggerUI from "swagger-ui-express"
import spec from './swagger-out.json'
dotenv.config();

const port = process.env.PORT || 8080;

const app: Application = express();
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(spec))

app.use('/admin',adminroute)


app.use('/user',userroute)

app.use(errorHandler)

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
