import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized access no token found" })
        }

        const user = await User.findById(decoded.UserId).select("-Password");

        if (!user) {
            return res.status(404).json({ message: "No user found" })
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error on protectRoute", error);
        return res.status(500).json({ message: "Internal server error" })

    }
}