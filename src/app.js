require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const app = express();
const connectDB = require("./db/db");
const PORT = process.env.PORT ?? 8000;

const authRouter = require("./routes/authRoute");
const ApiResponse = require("./utils/ApiResponse");

app.use(express.json());
app.use(helmet());
app.use(ApiResponse);
app.use("/api/auth", authRouter);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    console.log(`Connected To DB Successfully`);
    app.listen(PORT, () => {
      console.log(`Server Started at PORT: ${PORT}`);
    });

    app.get("/", (req, res) => {
      res.send("Hello World");
    });
  } catch (error) {
    console.log("Error in Connecting DB", error);
    process.exit(1);
  }
};

start();
