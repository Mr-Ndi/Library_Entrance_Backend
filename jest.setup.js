// jest.setup.js
import dotenv from 'dotenv';

dotenv.config();

process.env.MONGO_URI = `${process.env.MONGO_URI}_tests`;
