import { Router } from "express";
import historyRoutes from "./history.routes.js";
import userRoutes from "./user.routes.js";
import schoolRoutes from "./school.routes.js";

const routes = Router();

routes.use('/school')
routes.use('/history', historyRoutes);
routes.use('/user', userRoutes);

export default routes;