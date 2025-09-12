import sendMail from "../config/Mail.js"
import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signUp=async (req,res)=>{
    try {
        const {name,email,password,userName}=req.body
        const findByEmail=await User.findOne({email})
        if(findByEmail){
            return res.status(400).json({message:"Email already exists!"})
        }

        const findByUserName=await User.findOne({userName})
        if(findByUserName){
            return res.status(400).json({message:"UserName already exists!"})
        }

        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Name is required" });
        }

        if (!email || email.trim() === "") {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!userName || userName.trim() === "") {
            return res.status(400).json({ message: "Username is required" });
        }

        if (!password || password.trim() === "") {
            return res.status(400).json({ message: "Password is required" });
        }

        // Check for passowrd length must be at least 6
        if(password.length<6){
            return res.status(400).json({message:"Password must have atleast 6 characters "})
        }

        // Check for at least one number
        if (!/\d/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one number",
            });
        }

        // Check for at least one special character
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one special character",
            });
        }

        // Check for at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one uppercase letter",
            });
        }

        const hashedPassword=await bcrypt.hash(password,10)

        const user=await User.create({
            name,
            userName,
            email,
            password:hashedPassword
        })

        const token=await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:10*365*24*60*60*1000,
            secure:false,
            sameSite:"Strict"
        })

        return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json({message:`Signup error: ${error}`})
    }
}

export const signIn=async (req,res)=>{
    try {
        const {password,userName}=req.body

         // Check if username is provided
        if (!userName || userName.trim() === "") {
        return res.status(400).json({ message: "Username is required" });
        }

        // Check if password is provided
        if (!password || password.trim() === "") {
        return res.status(400).json({ message: "Password is required" });
        }
       
        const user=await User.findOne({userName})

        if(!user){
            return res.status(400).json({message:"User not found!"})
        }

        const isMatch=await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({message:"Incorrect Password!"})
        }

        const token=await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:10*365*24*60*60*1000,
            secure:false,
            sameSite:"Strict"
        })

        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({message:`Signin error: ${error}`})
    }
}


export const signOut=async (req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"Signed out successfully"})
    } catch (error) {
        return res.status(500).json({message:`Signout error: ${error}`})
    }
}

export const sendOtp=async (req,res)=>{
    try {
        const {email}=req.body
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"User not found!"})
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        user.resetOtp=otp,
        user.otpExpires=Date.now() + 5*60*1000
        user.isOtpVerified=false

       await user.save()
       await sendMail(email,otp)
       return res.status(200).json({message:"Email sent successfully!"})

    } catch (error) {
         return res.status(500).json({message:`Send otp error: ${error}`})
    }
}


export const verifyOtp=async (req,res)=>{
    try {
        const {email,otp}=req.body
        const user =await User.findOne({email})

        if(!user || user.resetOtp !== otp || user.otpExpires < Date.now()){
            return res.status(400).json({message:"Invalid/expired OTP"})
        }

        user.isOtpVerified=true
        user.resetOtp=undefined
        user.otpExpires=undefined

        await user.save()
        return res.status(200).json({message:"Otp verified"})

    } catch (error) {
        return res.status(500).json({message:`Verify otp error: ${error}`})
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if password is provided
        if (!password || password.trim() === "") {
            return res.status(400).json({ message: "Password is required" });
        }

        // Password length check
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must have at least 6 characters" });
        }

        // At least one number
        if (!/\d/.test(password)) {
            return res.status(400).json({ message: "Password must contain at least one number" });
        }

        // At least one special character
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return res.status(400).json({ message: "Password must contain at least one special character" });
        }

        // At least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
        }

        const user = await User.findOne({ email });
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "OTP verification required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.isOtpVerified = false;

        await user.save();
        return res.status(200).json({ message: "Password Reset Successfully" });

    } catch (error) {
        return res.status(500).json({ message: `Reset OTP error: ${error}` });
    }
};

