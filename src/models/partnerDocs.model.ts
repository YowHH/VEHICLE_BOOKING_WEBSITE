import mongoose from "mongoose";

interface IPartnerDocs {
    owner: mongoose.Types.ObjectId;
    idProofUrl: string;
    vehicleRegistrationUrl: string;
    licenseUrl: string;
    status: "approved" | "pending" | "rejected";
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const partnerDocsSchema = new mongoose.Schema<IPartnerDocs>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    idProofUrl: { type: String, required: true },
    vehicleRegistrationUrl: { type: String, required: true },
    licenseUrl: { type: String, required: true },
    status: {
        type: String,
        enum: ["approved", "pending", "rejected"],
        default: "pending"
    },
    rejectionReason: String,
}, {
    timestamps: true
})

const PartnerDocs = mongoose.models.PartnerDocs || mongoose.model("PartnerDocs", partnerDocsSchema)

export default PartnerDocs