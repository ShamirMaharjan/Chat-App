import mongoose from 'mongoose';

export const connect_db = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected: ${conn.connection.host}`);

    } catch (error) {
        console.log(`Error: ${error.message}`);

    }
}