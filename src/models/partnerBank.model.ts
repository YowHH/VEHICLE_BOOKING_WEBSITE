import mongoose from "mongoose";

interface IPartnerBank {
    owner: mongoose.Types.ObjectId;
    accountHolder: string;
    
    // 前端传过来的原始账号，存库前会被转换为 hash 和 masked
    accountNumberRaw?: string; 
    
    accountNumberMasked?: string;
    accountNumberHash: string;
    
    // 统一后的银行路由代码（例如 IFSC / SWIFT）
    bankCode?: string;
    
    iban?: string;
    
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
    // 这是一个虚拟/临时字段，不会真正存进 MongoDB
    accountNumberRaw: {
        type: String,
    },
    accountNumberMasked: {
        type: String,
        // 改为选填，因为 IBAN 有时不需要遮罩
    },
    accountNumberHash: {
        type: String,
        required: true,
        unique: true
    },
    // 统一银行代码，代替原来的 ifsc 和 swiftBic
    bankCode: {
        type: String,
        uppercase: true,
        trim: true,
    },
    iban: {
        type: String,
        uppercase: true,
        trim: true,
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
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
})

partnerBankSchema.index({ owner: 1 }, { unique: true });

const PartnerBank = mongoose.models.PartnerBank || mongoose.model<IPartnerBank>("PartnerBank", partnerBankSchema)

export default PartnerBank