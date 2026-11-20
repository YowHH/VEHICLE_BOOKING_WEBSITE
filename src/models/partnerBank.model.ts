import mongoose from "mongoose";

interface IPartnerBank {
    owner: mongoose.Types.ObjectId;
    accountHolder: string;
    accountNumberMasked: string;
    accountNumberHash: string;
    ifsc?: string;
    iban?: string;
    swiftBic?: string;
    paymentHandle?: string;
    paymentHandleType?: "duitnow" | "upi" | "paynow" | "promptpay" | "phone" | "email" | "other";
    verificationProvider?: "cashfree" | "setu" | "razorpay" | "other";
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
        trim: true
    },
    accountNumberMasked: {
        type: String,
        required: true
    },
    accountNumberHash: {
        type: String,
        required: true,
        unique: true
    },
    ifsc: {
        type: String,
        uppercase: true,
        match: /^[A-Z]{4}0[A-Z0-9]{6}$/
    },
    iban: {
        type: String,
        uppercase: true,
        match: /^[A-Z]{2}[0-9A-Z]{13,32}$/
    },
    swiftBic: {
        type: String,
        uppercase: true,
        match: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/
    },
    paymentHandle: String,
    paymentHandleType: {
        type: String,
        enum: ["duitnow", "upi", "paynow", "promptpay", "phone", "email", "other"]
    },

    verificationProvider: {
        type: String,
        enum: ["cashfree", "setu", "razorpay", "other"]
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