import { IUser } from "../../domain/entities/user"
import { collectorFullDetailsDto } from "../../dtos/collectorFullDetailsDto"

export interface IUserManagmentInteractor {
    toggleStatus(userId: string): void

    fetchUsers(page: number, limit: number, search: string): Promise<{users: Partial<IUser>[], total: number}>

    fetchCollectors(approvedStatus: string, page: number, limit: number, search: string): Promise<{collectors: Partial<collectorFullDetailsDto>[], total: number}>

    fetchUserDetail(userId: string): Promise<IUser>

    fetchCollectorDetails(userId: string): Promise<collectorFullDetailsDto>

    acceptRequest(collectorId: string, name: string, email: string): Promise<void>

    rejectRequest(collectorId: string, name: string, email: string): Promise<void>
}