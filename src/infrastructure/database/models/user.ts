import  { Schema, model, ObjectId } from "mongoose";
import { IUserDocument } from "../../../interfaces/documents/IUserDocument";




const userSchema = new Schema<IUserDocument>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        mobile: { type: String, required: true },
        googleId: { type: String, default: null },
        facebookId: { type: String, default: null },
        password: { type: String, default: null },
        role: { type: String, required: true },
        image: { type: String, default: null },
        address: {
            street: { type: String, required: true },
            houseNo: { type: String, required: true },
            district: { type: String, required: true },
            city: { type: String, required: true },
            pincode: { type: Number, required: true },
            location: {
                type: { type: String, default: 'Point', required: true },
                coordinates: { type: [Number], required: true },
            },
        },
        isBlock: { type: Boolean, default: false }
    },
    { timestamps: true }
);

userSchema.index({'address.location': '2dsphere'})

const userModel = model<IUserDocument>('user', userSchema)

export default userModel