import express from 'express';
const router = express.Router();
import userController from '../controllers/user.controller.js';

// Define GET route for session
router.get('/user/:reg', userController.requestSession);

export default router;