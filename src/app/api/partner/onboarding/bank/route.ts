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

        const { 
            accountHolder, 
            accountNumber, 
            bankCode, 
            paymentHandle, 
            paymentHandleType 
        } = await req.json()

        if (!accountHolder || !accountNumber || !bankCode) {
            return Response.json({ message: "Missing required bank details" }, { status: 400 })
        }

        const cleanAccountNumber = accountNumber.trim()
        const accountNumberHash = crypto.createHash("sha256").update(cleanAccountNumber).digest("hex")
        const accountNumberMasked = "****" + cleanAccountNumber.slice(-4)

        let ifscField = undefined;
        let swiftField = undefined;
        const upperBankCode = bankCode.toUpperCase();
        
        if (upperBankCode.length === 11 && upperBankCode[4] === "0") {
            ifscField = upperBankCode; 
        } else {
            swiftField = upperBankCode; 
        }

        const updateData: any = {
            accountHolder,
            accountNumberHash,
            accountNumberMasked,
            ifsc: ifscField,
            swiftBic: swiftField, 
            status: "added"
        }

        if (paymentHandle && paymentHandle.trim() !== "") {
            updateData.paymentHandle = paymentHandle.trim()
            updateData.paymentHandleType = paymentHandleType || "other"
        }

        const partnerBank = await PartnerBank.findOneAndUpdate(
            { owner: user._id },
            updateData,
            { upsert: true, new: true, runValidators: true }
        )

        await User.findByIdAndUpdate(user._id, {
            partnerOnBoardingSteps: 3,
            partnerStatus: "pending"
        })

        return Response.json(partnerBank, { status: 201 })

    } catch (error: any) {
        console.error("=== PARTNER BANK ERROR ===")
        console.error(error)
        return Response.json({ message: `partner bank error ${error.message}` }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email) {
            return Response.json({ message: "unauthorized" }, { status: 400 })
        }
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return Response.json({ message: "user not found" }, { status: 400 })
        }

        const partnerBank = await PartnerBank.findOne({ owner: user._id })
        if (partnerBank) {
            return Response.json(partnerBank, { status: 200 })
        } else {
            return null
        }
    } catch (error) {
        return Response.json({ message: `get partner bank error ${error}` }, { status: 500 })
    }
}