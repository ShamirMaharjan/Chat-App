import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connect_db } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cros from 'cors';
import { app, server } from './lib/socket.js';
dotenv.config();

import path from 'path';
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

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

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

server.listen(PORT, () => {
    console.log('Server is running on port 5000');
    connect_db();
})

