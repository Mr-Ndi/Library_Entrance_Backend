import {Router} from 'express';
import userController from '../controllers/user.controller.js';
import bodyValidator from "../../middleware/bodyValidation.middleware.js";
import { regNo, userSchema } from '../validation/user.validation.js'
import { regNoValidator } from '../../middleware/regNoValidator.middleware.js';

const userRoutes = Router();

userRoutes.route('/:reg').post(regNoValidator(regNo), userController.requestSession)
userRoutes.route('/').post(bodyValidator(userSchema), userController.addUser);

export default userRoutes;