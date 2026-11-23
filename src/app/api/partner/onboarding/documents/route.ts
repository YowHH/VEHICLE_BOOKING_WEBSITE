/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest } from "next/server";
import uploadOnCloudinary from "@/lib/cloudinary"
import PartnerDocs from "@/models/partnerDocs.model";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email) {
            return Response.json({
                message: "unauthorized",
            }, { status: 401 })
        }
        
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return Response.json({
                message: "user not found",
            }, { status: 404 })
        }

        const formdata = await req.formData()
        const idProof = formdata.get("idProof")
        const license = formdata.get("license")
        const vehicleRegistration = formdata.get("vehicleRegistration")

        if (
            !(idProof instanceof File) || idProof.size === 0 ||
            !(license instanceof File) || license.size === 0 ||
            !(vehicleRegistration instanceof File) || vehicleRegistration.size === 0
        ) {
            return Response.json({
                message: "All documents are required and cannot be empty.",
            }, { status: 400 })
        }

        const updatePayload: any = {
            status: "pending"
        }

        const idProofUrl = await uploadOnCloudinary(idProof)
        if (!idProofUrl) {
            return Response.json({
                message: "idProof upload failed.",
            }, { status: 500 })
        }
        updatePayload.idProofUrl = idProofUrl

        const licenseUrl = await uploadOnCloudinary(license)
        if (!licenseUrl) {
            return Response.json({
                message: "license upload failed.",
            }, { status: 500 })
        }
        updatePayload.licenseUrl = licenseUrl

        const vehicleRegistrationUrl = await uploadOnCloudinary(vehicleRegistration)
        if (!vehicleRegistrationUrl) {
            return Response.json({
                message: "vehicleRegistration upload failed.",
            }, { status: 500 })
        }
        updatePayload.vehicleRegistrationUrl = vehicleRegistrationUrl

        const partnerDocs = await PartnerDocs.findOneAndUpdate(
            { owner: user._id },
            { 
                $set: { 
                    ...updatePayload, 
                    owner: user._id 
                } 
            },
            { upsert: true, new: true, runValidators: true }
        )

        if (user.partnerOnBoardingSteps < 2) {
            user.partnerOnBoardingSteps = 2
            await user.save()
        }

        return Response.json(partnerDocs, { status: 201 })

    } catch (error: any) {
        console.error("=== PARTNER DOCS UPLOAD ERROR ===")
        console.error(error)
        return Response.json(
            { message: "Internal Server Error", detail: error?.message || String(error) },
            { status: 500 }
        )
    }
}