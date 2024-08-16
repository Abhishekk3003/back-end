// require('dotenv').config({path:'./.env'})

import dotenv from "dotenv";
import connectDB from "./DB/index.js";
import express from "express"

const app = express();

dotenv.config({path:'./.env'})

connectDB()
.then( () => {
      app.listen(process.env.PORT || 8001 , () => {
        console.log(`Server is running at ${process.env.PORT}`)
      });
} )
.catch((err) => {
    console.log("MongoDB Connection is Faled",err);
})