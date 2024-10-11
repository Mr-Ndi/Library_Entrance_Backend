import {Router} from 'express';
import userController from '../controllers/user.controller.js';

const router = Router();

// Define GET route for session
router.route('/user/:reg').get(userController.requestSession)
router.route('/user').post(userController.addUser);

export default router;