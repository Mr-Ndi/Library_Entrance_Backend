import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser:true,
            useUnifiedTopology: true
        });
        console.log("DB connection successful!");
    } catch (error) {
        console.error('Error connecting to database?!:', error.message);
        process.exit(1);
    }
}

export default dbConnection;