import { Router } from "express";

const schoolRoutes = Router();
schoolRoutes.route('/').get()

export default schoolRoutes;