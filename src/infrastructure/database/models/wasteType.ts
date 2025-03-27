import  { Schema, model, Types } from "mongoose";
import { IWasteTypeDocument } from "../../../interfaces/documents/IWasteTypeDocument";

const wasteTypeSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

const wasteTypeModel = model<IWasteTypeDocument>('waste_type', wasteTypeSchema)
export default wasteTypeModel