import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email || (session.user as { role?: string }).role !== "admin") {
            return Response.json({ message: "unauthorized" }, { status: 401 })
        }
        
        const totalPartners = await User.countDocuments({ role: "partner" })
        const totalApprovedPartners = await User.countDocuments({ role: "partner", partnerStatus: "approved" })
        const totalPendingPartners = await User.countDocuments({ role: "partner", partnerStatus: "pending" })
        const totalRejectedPartners = await User.countDocuments({ role: "partner", partnerStatus: "rejected" })

        const pendingPartnerUsers = await User.find({
            role: "partner",
            partnerStatus: "pending",
        })

        const partnerIds = pendingPartnerUsers.map((p) => p._id)
        const partnerVehicles = await Vehicle.find({
            owner: { $in: partnerIds }
        })
        const vehicleTypeMap = new Map(
            partnerVehicles.map((v) => [String(v.owner), v.type])
        )

        const pendingPartnerReviews = pendingPartnerUsers.map((p) => ({
            _id: p._id,
            name: p.name,
            email: p.email,
            vehicleType: vehicleTypeMap.get(String(p._id))
        }))

        const pendingVehicles = await Vehicle.find({ status: "pending" }).populate("owner", "name email")
        const pendingVehicleReviews = pendingVehicles.map((v) => ({
            _id: v._id,
            name: (v.owner as any)?.name || "Unknown",
            email: (v.owner as any)?.email || "No email",
            vehicleType: v.type,
        }))

        const pendingKycUsers = await User.find({ role: "partner", kycStatus: "pending" })
        const pendingKycReviews = pendingKycUsers.map((p) => ({
            _id: p._id,
            name: p.name,
            email: p.email,
        }))

        return NextResponse.json({
            stats: {
                totalPartners,
                totalApprovedPartners,
                totalPendingPartners,
                totalRejectedPartners,
            },
            pendingPartnerReviews,
            pendingVehicleReviews,
            pendingKycReviews
        }, {
            status: 200
        })

    } catch (error) {
        return NextResponse.json({
            message: `admin dashboard error ${error}`
        }, {
            status: 500
        })
    }
}