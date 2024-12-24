import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
export const signup = async (req, res) => {
    const { fullName, email, Password } = req.body

    try {
        if (!fullName || !email || !Password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (Password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }

        const user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ message: "Email already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hassedPassword = await bcrypt.hash(Password, salt);

        const newUser = new User({
            fullName,
            email,
            Password: hassedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res);

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        } else {
            return res.status(400).json({ message: "Something went wrong" })
        }
    } catch (error) {
        console.log("Error on signup", error);
        res.status(500).json({ message: "Internal server error" })

    }
}
export const login = async (req, res) => {
    const { email, Password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const isPasswordCorrect = await bcrypt.compare(Password, user.Password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })


    } catch (error) {
        console.log("Error on login", error);
        res.status(500).json({ message: "Internal server error" })

    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "");
        res.status(200).json({ message: "Logged out successfully" })

    } catch (error) {
        console.log("Error on logout", error);
        res.status(500).json({ message: "Internal server error" })

    }
}

export const updateProfile = async (req, res) => {
    const { profilePic } = req.body;

    try {
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" })
        }
        const uploadedResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId, { profilepic: uploadedResponse.secure_url }, { new: true });
        res.status(200).json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            profilePic: updatedUser.profilePic
        })
    } catch (error) {
        console.log("Error on updateProfile", error);
        res.status(500).json({ message: "Internal server error" })

    }

}

export const checkAuth = (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        res.status(200).json(req.user);

    } catch (error) {
        console.log("Error on checkAuth", error);
        res.status(500).json({ message: "Internal server error" })

    }


}