import { Admin } from "../../domain/entities/admin"
import { IAdminDocument } from "../documents/IAdminDocument"
import { IBaseRepository } from "./IBaseRepository"

export interface IAdminRepository extends IBaseRepository<IAdminDocument> {
    findAdminByEmail(email: string): Promise<Admin | null>
}