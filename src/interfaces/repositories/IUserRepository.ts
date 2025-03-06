import { IUser } from "../../domain/entities/user";
import { collectorFullDetailsDto } from "../../dtos/collectorFullDetailsDto";

export interface IUserRepository {
    findUserById(userId: string): Promise<IUser | null>
    findUserByEmail(email: string): Promise<IUser | null>
    saveUser(userData: Partial<IUser>): Promise<IUser>
    updateUser(user: Partial<IUser>): Promise<IUser>
    toggleUserStatus(userId: string): Promise<void>
    fetchAllUsers(): Promise<Partial<IUser>[]>
}