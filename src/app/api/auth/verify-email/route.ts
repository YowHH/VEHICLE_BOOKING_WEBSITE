import connectDb from "@/lib/db";
import User from "@/models/user.models";

export async function POST(req:Request){
    try {
        await connectDb()
        const { email, otp } = await req.json()
    if(!email || !otp){
        return Response.json({message: "Email and otp is required!"}, {status: 400})
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const user = await User.findOne({email: normalizedEmail})
    if(!user){
        return Response.json({message: "User not found!"}, {status: 400})
    }
    if(user.isEmailVerified){
        return Response.json({message: "Email is already verified!"}, {status: 400})
    }
    if(!user.otpExpiresAt || user.otpExpiresAt < new Date()){
        return Response.json({message: "OTP expired!"}, {status: 400})
    }
    if(!user.otp || String(user.otp) !== String(otp)){
        return Response.json({message: "Invalid OTP!"}, {status: 400})
    }

    user.isEmailVerified = true
    user.otp = undefined
    user.otpExpiresAt = undefined
    await user.save()

    return Response.json({message: "email is verified"}, {status: 200})

    } catch (error) {
        return Response.json(
            {message: `Verify email eror ${error}`},
            {status: 500}
        )
    }
}