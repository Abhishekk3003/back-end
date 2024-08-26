import express from "express.js";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit: "20kb"}));//to read the json data
app.use(express.urlencoded({extended:true,limit:"20kb"}));//This is a middleware function provided by Express.js to handle URL-encoded data (like form submissions).
app.use(express.static("public"))//express.static() is middleware in Express.js that serves static files such as HTML, CSS, JavaScript, images, and other assets from a specified directory. When you use this middleware, Express will automatically handle requests for files in that directory and respond with the requested file.
app.use(cookieParser())
//With cookie-parser middleware set up, you can read cookies sent by clients. You can also set cookies in your response
// routes import

import userRouter from "./Routes/user.routes.js"



// routes declarition
app.use("/api/v1/users",userRouter);

export {app};