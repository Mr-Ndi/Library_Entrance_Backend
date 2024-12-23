import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import swaggerDocument from "../swagger.json" with { type: "json" };
import dbConnection from "./config/database.js";
import routes from "./api/routes/index.js";
import errorHandler from "./middleware/errorHandler.middleware.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const connect = async () => await dbConnection();
connect();

app.get("/", (req, res) => res.redirect("/api-docs"));

app.use("/api", routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.use(errorHandler);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(
    `--------------------------------------\nServer running on port ${port}\n--------------------------------------`
  );
});

export {app, server};
