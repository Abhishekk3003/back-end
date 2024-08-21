
import mongoose ,{Schema} from "mongoose";
import { User } from "./user.model";


const subscriptionSchema =  new Schema(
    {
        channel:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },

        suscriber:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }

},{timestamps:true})



export const Subscription =mongoose.Model("Subscription",subscriptionSchema)