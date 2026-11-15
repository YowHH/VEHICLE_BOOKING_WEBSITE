import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.models";

export async function GET (req: Request) {
    try {
        await connectDb()
        const session = await auth()
        if(!session || !session.user){
            return Response.json(
                {message: "User is not authenticated!"},
                {status: 400}
            )
        }
        const user =  await User.findOne({email:session.user.email})
        if(!user){
            return Response.json(
                {message: "User not found!"},
                {status: 400}
            )
        }
    } catch (error) {
        
    }
}