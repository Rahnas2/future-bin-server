import { IUser } from "../../domain/entities/user"

export interface IUserInteractor {
    getUserProfile(userId: string): Promise<IUser>
    editUserProfile(data: Partial<IUser>, file?: Express.Multer.File): Promise<IUser>
}