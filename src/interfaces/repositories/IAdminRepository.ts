import { Admin } from "../../domain/entities/admin"

export interface IAdminRepository {
    findAdminByEmail(email: string): Promise<Admin | null>
}