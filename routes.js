// inbuilt function module.
import express from "express";

// custom file function module.
import userRouter from "./src/features/users/users.router.js";

const router = express.Router();

router.get('/', (req, res) => {
    return res.status(200).json({
        message: "API's router",
        success: true,
        status: 200
    })
});

router.use('/auth/user', userRouter)


// No routes match
router.use((req, res) => {
    return res.status(404).json({
        message: "API's not found",
        success: false,
        status: 404
    });
});

export default router;
