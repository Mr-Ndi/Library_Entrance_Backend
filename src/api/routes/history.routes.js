import { Router } from "express";
import { validateRecord } from "../controllers/history.controller.js";

const historyRoutes = Router();

historyRoutes.route('/:refId').get(validateRecord);

export default historyRoutes;