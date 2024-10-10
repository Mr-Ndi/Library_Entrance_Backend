import express from 'express';
const router = express.Router();
import userService from '../../services/user.service.js';
import userController from '../controllers/user.controller.js';


router.get('/user/:reg', userController.requestSession);

export default {router };