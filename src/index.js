import express from "express";
import mongoose from "mongoose";
import swaggerUi from 'swagger-ui-express';
import cors from "cors";
import swaggerDocument from '../swagger.json' assert { type: 'json' };
import dbConnection from "./config/database.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

await dbConnection();


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 5000;
// Start the Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});