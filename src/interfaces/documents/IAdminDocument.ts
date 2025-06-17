import { Document } from "mongoose";
import { Admin } from "../../domain/entities/admin";

export interface IAdminDocument extends Admin, Document {
    _id: string
}