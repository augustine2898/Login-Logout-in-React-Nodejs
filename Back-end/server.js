import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser"
import connectDB from "./config/mongodb.js";
import authRoutes from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"
import fileUpload from "express-fileupload";
const app = express();
const port = process.env.Port || 4000
connectDB();
const allowedOrigins=['http://localhost:5173']


app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials: true}))
app.use(fileUpload({ useTempFiles: true }));
//API endpoints
app.get('/',(req,res)=>{res.send("api working")});
app.use('/api/auth',authRoutes);
app.use('/api/user',userRouter);
app.use('/api/admin/',adminRoutes)


app.listen(port,()=>console.log(`server started on port:${port}`));



