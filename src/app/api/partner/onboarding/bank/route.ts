import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email) {
            return Response.json({ message: "unauthorized" }, { status: 401 })
        }
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return Response.json({ message: "user not found" }, { status: 404 })
        }

        // 1. 接收前端传来的参数
        const { 
            accountHolder, 
            accountNumber, 
            bankCode,        // 👈 接收前端传的 bankCode
            paymentHandle,   // 👈 选填
            paymentHandleType // 👈 选填
        } = await req.json()

        // 2. 只校验这三个必填项（注意：去掉了 ifsc 和 mobileNumber）
        if (!accountHolder || !accountNumber || !bankCode) {
            return Response.json({ message: "Missing required bank details" }, { status: 400 })
        }

        // 3. 处理账号加密和脱敏
        const cleanAccountNumber = accountNumber.trim()
        const accountNumberHash = crypto.createHash("sha256").update(cleanAccountNumber).digest("hex")
        const accountNumberMasked = "****" + cleanAccountNumber.slice(-4)

        // 4. 处理 bankCode：由于你前端合并了 IFSC 和 SWIFT，你需要判断它存哪个字段
        // 简单判断：如果是 11 位且第 5 位是 0，大概率是 IFSC；否则存入 swiftBic 或统一存 bankCode
        let ifscField = undefined;
        let swiftField = undefined;
        const upperBankCode = bankCode.toUpperCase();
        
        if (upperBankCode.length === 11 && upperBankCode[4] === "0") {
            ifscField = upperBankCode; // 存入 ifsc 字段
        } else {
            swiftField = upperBankCode; // 存入 swiftBic 字段 (如果你模型里有)
        }

        // 5. 构建更新对象
        const updateData: any = {
            accountHolder,
            accountNumberHash,
            accountNumberMasked,
            ifsc: ifscField,
            swiftBic: swiftField, // 如果你模型里有 swiftBic 字段
            status: "added"
        }

        // 6. 选填逻辑：只有传了 paymentHandle 才更新
        if (paymentHandle && paymentHandle.trim() !== "") {
            updateData.paymentHandle = paymentHandle.trim()
            updateData.paymentHandleType = paymentHandleType || "other"
        }

        const partnerBank = await PartnerBank.findOneAndUpdate(
            { owner: user._id },
            updateData,
            { upsert: true, new: true, runValidators: true }
        )

        if (user.partnerOnBoardingSteps < 3) {
            user.partnerOnBoardingSteps = 3
        }
        await user.save()

        return Response.json(partnerBank, { status: 201 })

    } catch (error: any) {
        console.error("=== PARTNER BANK ERROR ===")
        console.error(error)
        return Response.json({ message: `partner bank error ${error.message}` }, { status: 500 })
    }
}

export async function GET(req:NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if(!session || !session.user?.email) {
            return Response.json({
                message: "unauthorized",
            },{status: 400})
        }
        const user = await User.findOne({email: session.user.email})
        if(!user){
            return Response.json({
                message: "user not found",
            },{status: 400})
        }

        const partnerBank = await PartnerBank.findOne({owner:user._id})
        if(partnerBank){
            return Response.json( partnerBank ,{status: 200})
        } else {
            return null
        }
    } catch (error) {
        return Response.json({message: `get partner bank error ${error}`},{status: 500})
    }
}