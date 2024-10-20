import { Router } from "express";
import { validateRecord } from "../controllers/history.controller.js";

const historyRoutes = Router();

historyRoutes.route('/:ticketId').get(validateRecord);

export default historyRoutes;