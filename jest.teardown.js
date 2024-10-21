// jest.teardown.js
import dotenv from "dotenv";

dotenv.config();

export default async () => {
    if (process.env.MONGO_URI) {
        process.env.MONGO_URI = process.env.MONGO_URI.replace('_tests', ''); // remove _tests suffix
    } else {
        console.warn('MONGO_URI is undefined during teardown.');
    }
};
