import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connect_db } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cros from 'cors';

dotenv.config();
const app = express();

app.use(express.json());

app.use(cookieParser());
app.use(cros({
    origin: "http://localhost:5173",
    credentials: true
}));



app.use("/api/auth", authRoutes);

app.use("/api/message", messageRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server is running on port 5000');
    connect_db();
})

