import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "manager", "admin"],
        default: "user"
    },
});

const UserModel = mongoose.model('Users', userSchema);

export default UserModel;