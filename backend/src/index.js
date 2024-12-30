import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connect_db } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cros from 'cors';
import { app, server } from './lib/socket.js';
dotenv.config();


app.use(express.json({ limit: "10mb" }));

app.use(cookieParser());

app.use(cros({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,

}));



app.use("/api/auth", authRoutes);

app.use("/api/message", messageRoutes)

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log('Server is running on port 5000');
    connect_db();
})

