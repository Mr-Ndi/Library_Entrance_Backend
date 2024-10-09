import express from "express";
import routes from './api/routes/user.routes.js';
import swaggerUi from 'swagger-ui-express';
import cors from "cors";
import swaggerDocument from '../swagger.json' assert { type: 'json' };
import dbConnection from "./config/database.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

await dbConnection();

app.use('/api', routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`--------------------------------------\nServer running on port ${port}\n--------------------------------------`);
});