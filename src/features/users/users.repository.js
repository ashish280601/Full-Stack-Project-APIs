import UserModel from "./users.model.js";
export default class UserRepository {
    // write your code logic here
    async signUp(userData) {
        console.log('user Data in db', userData);

        // Check for required fields
        if (!userData.userName || !userData.password) {
            throw new Error('Missing required fields: userName and password are required.');
        }

        try {
            const newUser = new UserModel(userData);
            await newUser.save();
            return newUser;

        } catch (error) {
            console.error("Error in signUp:", error);

            // Check for validation errors or duplicate key errors
            if (error.name === "ValidationError") {
                const validationError = new Error("Validation error occurred");
                validationError.statusCode = 400;
                throw validationError;

            } else if (error.name === "MongoServerError" && error.code === 11000) {
                const duplicateError = new Error("User with this userName already exists.");
                duplicateError.statusCode = 409;
                throw duplicateError;

            } else {
                const generalError = new Error("Something went wrong with the database");
                generalError.statusCode = 500;
                throw generalError;
            }
        }
    }


    async findByUserName(userName) {
        try {
            const user = await UserModel.findOne({ userName });
            return user;
        } catch (error) {
            throw new Error("Something went wrong with database", 500);
        }
    }
}