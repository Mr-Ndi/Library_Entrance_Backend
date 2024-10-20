import {Router} from 'express';
import userController from '../controllers/user.controller.js';

const userRoutes = Router();

// Define GET route for session
userRoutes.route('/:reg').get(userController.requestSession)
userRoutes.route('/').post(userController.addUser);

export default userRoutes;