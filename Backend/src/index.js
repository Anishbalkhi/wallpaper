import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); 
import express from "express";
import ConnectDB from "./config/db.js"; 
import router from "./routes/authRoutes.js";
import cookieParser from 'cookie-parser'
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
const app = express();
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("Cookies: ", req.cookies);
  next();
});

app.use(express.json());


ConnectDB();

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter)
  // console.log('Cookies: ', req.cookies)
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
