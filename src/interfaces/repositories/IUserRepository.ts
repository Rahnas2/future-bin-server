import { IUser } from "../../domain/entities/user";
import { collectorFullDetailsDto } from "../../dtos/collectorFullDetailsDto";
import { locationDto } from "../../dtos/locationDto";
import { BaseRepository } from "../../infrastructure/database/repositories/baseRepository";
import { IUserDocument } from "../documents/IUserDocument";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends BaseRepository<IUserDocument> {
    findUserById(userId: string): Promise<IUser | null>
    findUserByEmail(email: string): Promise<IUser | null>
    findUserByGoogleId(googleId: string | undefined): Promise<IUser | null>
    findUserByFacebookId(facebookId: string): Promise<IUser | null>
    saveUser(userData: Partial<IUser>): Promise<IUser>
    chagePassword(id: string, newPassword: string): Promise<IUser | null>
    toggleUserStatus(userId: string): Promise<void>

    fetchAllUsers(page: number, limit: number): Promise<{users: Partial<IUser>[], total: number}>
    
    findNearCollectorsId(location: locationDto, maxDistance: number): Promise<{_id: string, firstName: string, lastName: string}[] | null>
}