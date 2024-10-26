// custom file function module.
import "./env.js";

// inbuilt function module.
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// custom file function module.
import { connectDB } from "./src/config/db.js";
import router from "./routes.js";

const app = express();

const port = process.env.PORT || 7050;

// setting up an access to the client side user URL.
const corsOptions = {
    origin: ['http:localhost:7000','http:localhost:7050'],
    methods: '*',
    allowedHeaders: '*'
};

// setting an request limit for per IP users.
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'To many requests, please try again later.'
});

// root routes
app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Welcome to task manager application",
        success: true,
        status: 200
      })  
});

// middleware 
app.use(limiter);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '500mb'}));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));
app.use('/api', router);

app.listen(port, async() => {
    try {
        await connectDB();
        console.log(`Server is connected to http://localhost:${port}`);
    } catch (error) {
        console.error("Something went wrongs while connecting...", error.message);
        
    }
})

