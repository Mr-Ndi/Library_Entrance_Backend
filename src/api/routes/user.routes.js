import {Router} from 'express';
import userController from '../controllers/user.controller.js';
import bodyValidator from "../../middleware/bodyValidation.middleware.js";
import { regNo, userSchema } from '../validation/user.validation.js'
import { regNoValidator } from '../../middleware/regNoValidator.middleware.js';

const userRoutes = Router();

// Define GET route for session
userRoutes.route('/:reg').get(regNoValidator(regNo), userController.requestSession)
userRoutes.route('/').post(bodyValidator(userSchema), userController.addUser);

export default userRoutes;