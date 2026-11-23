import mongoose from "mongoose";

type vehicleType= "motor" | "car" | "van" | "4wd" | "lorry"

interface IVehicle{
    owner: mongoose.Types.ObjectId;
    type: vehicleType;
    vehicleModel: string;
    number: string;
    imageUrl?:string;
    baseFare?:number;
    pricePerKM?:number;
    waitingCharge?: number;
    status: "approved" | "pending" | "rejected";
    rejectionReason?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date
}

const vehicleSchema = new mongoose.Schema<IVehicle>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    type: {
        type: String,
        enum:["motor",  "car" , "van" , "4wd" , "lorry"],
        required: true
    },
    number: {
        type: String,
        required: true,
        unique: true
    },
    vehicleModel: {
        type: String,
        required: true,
    },
    imageUrl:String,
    baseFare:Number,
    pricePerKM:Number,
    waitingCharge: Number,
    status: {
        type: String,
        enum: ["approved", "pending", "rejected"],
        default: "pending"
    },
    rejectionReason: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

const Vehicle = mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema)

export default Vehicle