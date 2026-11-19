import mongoose from "mongoose";

interface IPartnerBank {
    owner: mongoose.Types.ObjectId;
    accountHolder: string;
    accountNumber: string;
    ifsc: string;
    upi?: string;
    verificationProvider?: "cashfree" | "setu" | "razorpay";
    nameMatchScore?: number;
    accountStatus?: "active" | "invalid" | "unknown";
    verifiedAt?: Date;
    status: "not_added" | "added" | "verified";
    createdAt: Date;
    updatedAt: Date;
}

const partnerBankSchema = new mongoose.Schema<IPartnerBank>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    accountHolder: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    ifsc: {
        type: String,
        required: true,
        uppercase: true,
        match: /^[A-Z]{4}0[A-Z0-9]{6}$/
    },
    upi: String,

    verificationProvider: {
        type: String,
        enum: ["cashfree", "setu", "razorpay"]
    },
    nameMatchScore: Number,
    accountStatus: {
        type: String,
        enum: ["active", "invalid", "unknown"]
    },
    verifiedAt: Date,

    status: {
        type: String,
        enum: ["not_added", "added", "verified"],
        default: "not_added"
    },
}, {
    timestamps: true
})

partnerBankSchema.index({ owner: 1 }, { unique: true });

const PartnerBank = mongoose.models.PartnerBank || mongoose.model<IPartnerBank>("PartnerBank", partnerBankSchema)

export default PartnerBank