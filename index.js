const express = require("express");
const { connectDB } = require("./connection");
const app = express();
const PORT = 8002;
const MONGOURL = 'mongodb://localhost:27017/practice';
const userRouter = require("./routes/user");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: "*", // Adjust this for production
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
};

// Routes for CORS
app.use(cors(corsOptions)); // Apply CORS globally

// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(
    cors({
        origin: ["http://localhost:8002/", "http://localhost:5173/"],
    })
);

app.use(
    cors({
        origin: ["http://localhost:8002/", "http://localhost:5173/"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Connect to MongoDB
connectDB(MONGOURL).then(() => {
    console.log("Mongo Connected");
});

app.get("/", (req, resp) => {
    resp.end("Hey");
});

app.use("/api/users", userRouter);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});