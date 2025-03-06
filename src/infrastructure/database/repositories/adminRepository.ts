import { injectable } from "inversify";
import adminModel from "../models/admin";
import { IAdminRepository } from "../../../interfaces/repositories/IAdminRepository";
import { Admin } from "../../../domain/entities/admin";

@injectable()
export class adminRepository implements IAdminRepository {
    async findAdminByEmail(email: string): Promise<Admin | null> {
        return await adminModel.findOne({email})
    }
}