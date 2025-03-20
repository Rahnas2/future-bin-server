import { injectable } from "inversify";
import { IUser } from "../../../domain/entities/user";
import { notFound } from "../../../domain/errors";
import { IUserRepository } from "../../../interfaces/repositories/IUserRepository";
import userModel from "../models/user";
import { collectorFullDetailsDto } from "../../../dtos/collectorFullDetailsDto";
import { locationDto } from "../../../dtos/locationDto";
import { BaseRepository } from "./baseRepository";
import { Document, Model, Types } from "mongoose";
import { IUserDocument } from "../../../interfaces/documents/IUserDocument";



@injectable()
export class userRepository extends BaseRepository<IUserDocument> implements IUserRepository {

    constructor(){
        super(userModel)
    }

    //find user by mongo id
    async findUserById(userId: string): Promise<IUser | null> {
        return await userModel.findById(userId)
    }

    //find user by email
    async findUserByEmail(email: string): Promise<IUser | null> {
        return await userModel.findOne({ email })
    }

    //find user by google id
    async findUserByGoogleId(googleId: string): Promise<IUser | null> {
        return await userModel.findOne({ googleId: googleId })
    }

    //find user by facebook id
    async findUserByFacebookId(facebookId: string): Promise<IUser | null> {
        return await userModel.findOne({ facebookId: facebookId })
    }

    //save new user
    async saveUser(userData: Partial<IUser>): Promise<IUser> {
        return await userModel.create(userData)
    }

    //update user data
    // async updateUser(userData: Partial<IUser>): Promise<IUser> {
    //     const user = await userModel.findByIdAndUpdate(userData._id, userData, { new: true });
    //     if (!user) {
    //         throw new notFound('user not found')
    //     }
    //     return user
    // }

    //change password 
    async chagePassword(id: string, newPassword: string): Promise<IUser | null> {
        return await this.model.findByIdAndUpdate(id, { password: newPassword }, { new: true })
    }

    //find all users
    async fetchAllUsers(): Promise<Partial<IUser>[]> {
        return await userModel.find({ role: 'resident' },
            { firstName: 1, lastName: 1, email: 1, mobile: 1, image: 1, 'address.district': 1, 'address.city': 1 }
        )
    }

    //toggle users status block or unblok
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

    //find collectors from particlar distance
    async findNearCollectorsId(location: locationDto, maxDistance: number): Promise<{_id: string, firstName: string, lastName: string}[] | null> {
        try {
            return await userModel.find({
                role: 'collector',
                'address.location': {
                    $near: {
                        $geometry: location,
                        $maxDistance: maxDistance
                    }
                }
            }, { _id: 1, firstName: 1, lastName: 1 })
        } catch (error) {
            console.log('nearby locaiotn error ', error)
            return null
        }

    }

}