import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            res.status(401).json({ message: "Unauthorized access" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            res.status(401).json({ message: "Unauthorized access no token found" })
        }

        const user = await User.findById(decoded.UserId).select("-Password");

        if (!user) {
            res.status(404).json({ message: "No user found" })
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error on protectRoute", error);
        res.status(500).json({ message: "Internal server error" })

    }
}