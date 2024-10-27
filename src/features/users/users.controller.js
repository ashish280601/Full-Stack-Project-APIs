import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserRepository from "./users.repository.js";


export default class UserController {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async signUp(req, res) {
        const { userName, password, role } = req.body;
        console.log("userName", userName);
        console.log("password", password);
        console.log("role", role);

        try {
            const saltRound = 10;
            const hashedPassword = await bcrypt.hash(password, saltRound);
            console.log("hashedPassword", hashedPassword);

            const userData = {
                userName,
                password: hashedPassword,
                role
            }
            console.log("userData", userData);
            const newUser = await this.userRepository.signUp(userData);
            console.log("newUser", newUser);

            return res.status(200).json({
                newUser,
                message: "User created successfully",
                success: true,
                status: 200
            });
        } catch (error) {
            console.log("error", error);
            return res.status(error.statusCode || 500).json({
                message: error.message,
                success: false,
                status: error.statusCode || 500
            });
        }

    }

    async signIn(req, res) {
        // write your code here
        console.log(req.body);
        try {
            const { userName, password } = req.body;

            // finding the email user is present or not
            const user = await this.userRepository.findByUserName(userName);
            console.log("userData", user);

            // if email user is not found send error
            if (!user) {
                return res.status(401).json({
                    message: "Invalid user name credentials",
                    success: false,
                    status: 401,
                });
            } else {
                // compare the passowrd
                const result = await bcrypt.compare(password, user.password);
                // password matches then generate a token
                if (result) {
                    console.log("userName", user.userName)
                    const token = jwt.sign(
                        {
                            userID: user._id,
                            userName: user.userName,
                            role: user.role,
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "1hr",
                        }
                    );
                    return res.status(200).json({
                        data: {
                            message: "User Login Successful",
                            success: true,
                            status: 200,
                            userID: user._id,
                            userName: user.userName,
                            userRole: user.role,
                            token,
                        }
                    });
                }
                return res.status(401).json({
                    message: "Invalid user password credentials",
                    success: false,
                    status: 401,
                });
            }
        } catch (error) {
            // Detailed error handling
            console.error("Error in signUp:", error);

            // Custom error messages based on error type
            let errorMessage = "Something went wrong";
            if (error.name === "ValidationError") {
                errorMessage = "Validation error occurred";
            } else if (error.name === "MongoError" && error.code === 11000) {
                errorMessage = "Duplicate key error";
            }

            return res.status(500).json({
                message: errorMessage,
                success: false,
                status: 500
            });
        }
    }
}