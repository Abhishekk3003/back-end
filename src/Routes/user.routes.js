import { Router } from "express";
import { registerUser,loginUser,logoutUser } from "../Controllers/user.controller.js";
import { upload } from "../Middleware/multer.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverimage",
            maxCount:1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser)

// secure browser

router.route("/logout").post(logoutUser)


export default router