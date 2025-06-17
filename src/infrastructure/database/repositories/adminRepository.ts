import { injectable } from "inversify";
import adminModel from "../models/admin";
import { IAdminRepository } from "../../../interfaces/repositories/IAdminRepository";
import { Admin } from "../../../domain/entities/admin";
import { BaseRepository } from "./baseRepository";
import { IAdminDocument } from "../../../interfaces/documents/IAdminDocument";

@injectable()
export class adminRepository extends BaseRepository<IAdminDocument> implements IAdminRepository {
    async findAdminByEmail(email: string): Promise<Admin | null> {
        return await adminModel.findOne({email})
    }
}