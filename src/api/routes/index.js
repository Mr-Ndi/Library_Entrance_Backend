import { Router } from "express";
import historyRoutes from "./history.routes.js";
import userRoutes from "./user.routes.js";

const routes = Router();

routes.use('/history', historyRoutes);
routes.use('/user', userRoutes);

export default routes;