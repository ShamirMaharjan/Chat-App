import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverScocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } });

        res.json(filteredUsers);

    } catch (error) {
        console.log("Error on getUserForSidebar", error);
        res.status(500).json({ message: "Internal Server Error" });

    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params

        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, reciverId: userToChatId },
                { senderId: userToChatId, reciverId: myId }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error on getMessages", error);
        res.status(500).json({ message: "Internal Server Error" });

    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: reciverId } = req.params

        const senderId = req.user._id;

        let imageurl;

        if (image) {
            const uploadedResponse = await cloudinary.uploader.upload(image);
            imageurl = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            reciverId,
            text,
            image: imageurl
        });

        await newMessage.save();

        const receiverSocketId = getReceiverScocketId(reciverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json(newMessage);


    } catch (error) {
        console.log("Error on sendMessage", error);
        res.status(500).json({ message: "Internal Server Error" });

    }

}