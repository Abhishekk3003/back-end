// require('dotenv').config({path:'./.env'})

import dotenv from "dotenv";
import connectDB from "./DB/index.js";

dotenv.config({path:'./.env'})

connectDB()
.then( () => {
      app.listen(process.env.PORT || 8001 , () => {
        console.log(`Server is running at ${process.env.PORT}`)
      });
} )
.catch((err) => {
    console.log("MongoDB Connection is Failed",err);
})