import mongoose from "mongoose";
import { IUser } from "../../domain/entities/user";
import { ICollector } from "../../domain/entities/collector";

export interface IAuthRepository {
    findByEmail(email: string): Promise<IUser  | null>; 
    saveUser(userData: IUser): Promise<mongoose.ObjectId>
    saveCollector(collectorData: any): void
}