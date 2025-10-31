import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); 
import express from "express";
import ConnectDB from "./config/db.js"; 
import cookieParser from 'cookie-parser'
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import cors from "cors"
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("Cookies: ", req.cookies);
  next();
});
app.use(cors({
  origin: "http://localhost:5173", // React dev server
  credentials: true
}));



ConnectDB();

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/post" , postRouter);




const PORT = 5000;
app.get("/",(req,res)=>{
  res.send("api working")
})
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});