import {asyncHandler} from "../Utilis/asynchandler.js";
import {ApiError} from "../Utilis/ApiError.js";
import { User } from "../Models/user.model.js";
import { uploadOnCloudinary} from "../Utilis/cloudinary.js";
import { ApiResponse } from "../Utilis/ApiResponse.js";


const generateAccessAndRefreshToken = async (userID) => {
    const user= await User.findById(userID)
    const accessToken = user.genrateAccessToken()
    const refreshToken=  user.genrateRefreshToken()
    
    // now it's time to save the refreshtoken in database

    user.refreshToken = refreshToken

   await user.save({validateBeforeSave:false})

   return (accessToken,refreshToken)


}

const registerUser = asyncHandler(async (req,res) => {
 
    // get user from frontened
    // validation - email,username
    // check if user alreadyexist : email
    // chexk for images,avatar
    // upload them on cloudinary 
    // create objects - create entry in DB
    // remove password and refresh token field from response
    // check for user creation
    // return response



    // 1 Get details from user
    const{fullName,username,email,password} = req.body

     
    // Multer handle all the file handling and upload in cloudinary

    // 2 check the validation

    // if(fullName === "") {
    //     throw new ApiError(400,"fullName is required")
    // }

    if(
        [fullName,username,email,password].some((field) => 
        field?.trim() === "")
    ){
       throw new ApiError(400,"All fields are required")
    }

    // 3 check the user is alredy exists or not,for this we need User to check the email or fullName is already exists or not

   const existsUser = await User.findOne({
        $or:[{ username },{ email }]
    })

    if (existsUser) {
        throw new ApiError(409,"user name or email is already exits")
    }


    // 4 check images or check avatar
    //  multer gives a method name filesto check either file or images are uploded or not

    const avatarLocalPath =  req.files?.avatar[0]?.path;
    const coverimageLocalPath =  req.files?.coverimage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");

    }

    // 5 uplaod the avatar and images into cloudianry
    
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const covsrImage  = await uploadOnCloudinary(coverimageLocalPath);

    if(!avatar) {
        throw new ApiError(400,"Avatar file is required");
    }


    //  6 Now use User to talk with database

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverimage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500,"Something went worng while registering the user")
    }


    // send the response
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user register successfully")
    )



})


const loginUser = asyncHandler(async (req,res) => {
    // get data details from req body
    // check validation
    // find the user
    // password check
    // access token refresh token
    // send cookies
    
   const {username,email,password} = req.body

   if(!username && !email){
    throw new ApiError(400,"username or email is required")
   }

 const user = await User.findOne({
    $or:[{username},{email}]
   })

   if(!user){
    throw new ApiError(404,"user doesnot exists")
   }

   const isPasswordValid = await user.isPasswordCorrect(password) 

   if(!isPasswordValid){
    throw new ApiError(401,"Invalid user credentials")
   }


   const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

   const LoggedinUser = await User.findById(user._id).select("-password -refreshToken")

// send cookie before we send the cookie first we need cookie option to handle the security

   const options = {
    httpOnly:true,
    secure:true
   }

   return res
   .status(400)
   .cookie("accessToken",accessToken,options)
   .cookie("refrshToken",refreshToken,options)
   .json(
       new ApiResponse(
        200,
        {
            user:LoggedinUser,accessToken,refreshToken
        },
        "user logged in successfully"
       )
   )

   
  
   



})

const logoutUser = asyncHandler(async (req,res) => {

})

export {registerUser,loginUser,logoutUser};