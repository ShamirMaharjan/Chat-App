import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true

    },
    fullName: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true,
        minLenght: 6
    },
    profilePic: {
        type: String,
        default: ''
    }
},
    { timestamp: true })

const User = mongoose.model("User", userSchema);
export default User;