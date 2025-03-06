import { injectable } from "inversify";
import { IUser } from "../../../domain/entities/user";
import { notFound } from "../../../domain/errors";
import { IUserRepository } from "../../../interfaces/repositories/IUserRepository";
import userModel from "../models/user";
import { collectorFullDetailsDto } from "../../../dtos/collectorFullDetailsDto";

@injectable()
export class userRepository implements IUserRepository {

    async findUserById(userId: string): Promise<IUser | null> {
        return await userModel.findById(userId)
    }
    async findUserByEmail(email: string): Promise<IUser | null> {
        return await userModel.findOne({ email })
    }

    async saveUser(userData: Partial<IUser>): Promise<IUser> {
        return await userModel.create(userData)
    }

    async updateUser(userData: Partial<IUser>): Promise<IUser> {
        const user = await userModel.findByIdAndUpdate(userData._id, userData, { new: true });
        if (!user) {
            throw new notFound('user not found')
        }
        return user
    }

    async fetchAllUsers(): Promise<Partial<IUser>[]> {
        return await userModel.find({ role: 'resident' },
            { firstName: 1, lastName: 1, email: 1, mobile: 1, image: 1, 'address.district': 1, 'address.city': 1 }
        )
    }

    async toggleUserStatus(userId: string): Promise<void> {
        const user = await this.findUserById(userId)

        if (!user) {
            throw new notFound('user not found')
        }

        const status = user.isBlock
        await userModel.findByIdAndUpdate(userId, {
            $set: {
                isBlock: !status
            }
        }, { new: true })
    }

}