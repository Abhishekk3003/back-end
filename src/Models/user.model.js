

import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
   
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    fullName:{
        type:String,
        required:true
    },
    avatar:{
        type:String, //cloudinary url
        required:true
    },
    coverImage:{
        type:String, //cloudinary url
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String,
        required:true
    }


},{timestamps:true})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password,10) 
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password,this.password) 
    // compare gives us true false
}

userSchema.methods.genrateAccessToken = function () {
    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email : this.email

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.genrateRefreshToken = function () {
    return jwt.sign(
        {
            _id : this._id,
           

        },
        process.env.ACCESS_REFRESH_SECRET,
        {
            expiresIn : process.ACCESS_REFRESH_EXPIRY
        }
    )

}


export const User = mongoose.model("User",userSchema);