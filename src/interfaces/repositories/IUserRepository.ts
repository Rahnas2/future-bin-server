import { IUser } from "../../domain/entities/user";
import { collectorFullDetailsDto } from "../../dtos/collectorFullDetailsDto";
import { locationDto } from "../../dtos/locationDto";

export interface IUserRepository {
    findUserById(userId: string): Promise<IUser | null>
    findUserByEmail(email: string): Promise<IUser | null>
    findUserByGoogleId(googleId: string | undefined): Promise<IUser | null>
    findUserByFacebookId(facebookId: string): Promise<IUser | null>
    saveUser(userData: Partial<IUser>): Promise<IUser>
    updateUser(user: Partial<IUser>): Promise<IUser>
    chagePassword(id: string, newPassword: string): Promise<IUser | null>
    toggleUserStatus(userId: string): Promise<void>
    fetchAllUsers(): Promise<Partial<IUser>[]>
    findNearCollectorsId(location: locationDto, maxDistance: number): Promise<{_id: string, firstName: string, lastName: string}[] | null>
}