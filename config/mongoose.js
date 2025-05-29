import "dotenv/config.js"
import mongoose from "mongoose";

const connectToDatabase = async () => {
    try {
        const URI = process.env.MONGODB_URI;

        await mongoose.connect(URI);

        console.log('Database connection successful',URI);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Exit the process with failure
    }
}

export {connectToDatabase as mongooseConnection};