
import { Admin } from "mongodb";
import { Schema, model } from "mongoose";


const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true }
)

const adminModel = model<Admin>('admin', adminSchema)
export default adminModel