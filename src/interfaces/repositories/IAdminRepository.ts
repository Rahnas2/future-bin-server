import { Admin } from "../../domain/entities/admin"
import { summaryDto } from "../../dtos/summaryDto"

export interface IAdminRepository {
    findAdminByEmail(email: string): Promise<Admin | null>
}