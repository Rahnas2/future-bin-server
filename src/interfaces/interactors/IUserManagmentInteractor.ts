import { IUser } from "../../domain/entities/user"
import { collectorFullDetailsDto } from "../../dtos/collectorFullDetailsDto"

export interface IUserManagmentInteractor {
    toggleStatus(userId: string): void

    fetchUsers(): Promise<Partial<IUser>[]>

    fetchCollectors(approvedStatus: string): Promise<Partial<collectorFullDetailsDto>[]>

    fetchUserDetail(userId: string): Promise<IUser>

    fetchCollectorDetails(userId: string): Promise<collectorFullDetailsDto>

    acceptRequest(collectorId: string, name: string, email: string): Promise<void> 

    rejectRequest(collectorId: string, name: string, email: string): Promise<void>
}