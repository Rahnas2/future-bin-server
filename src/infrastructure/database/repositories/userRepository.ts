import { injectable } from "inversify";
import { IUser } from "../../../domain/entities/user";
import { notFound } from "../../../domain/errors";
import { IUserRepository } from "../../../interfaces/repositories/IUserRepository";
import userModel from "../models/user";
import { collectorFullDetailsDto } from "../../../dtos/collectorFullDetailsDto";
import { locationDto } from "../../../dtos/locationDto";
import { BaseRepository } from "./baseRepository";
import { Document, FilterQuery, Model, Types } from "mongoose";
import { IUserDocument } from "../../../interfaces/documents/IUserDocument";



@injectable()
export class userRepository extends BaseRepository<IUserDocument> implements IUserRepository {

    constructor() {
        super(userModel)
    }

    //find user by mongo id
    async findUserById(userId: string): Promise<IUser | null> {
        return await this.model.findById(userId)
    }

    //find user by email
    async findUserByEmail(email: string): Promise<IUser | null> {
        return await this.model.findOne({ email })
    }

    //find user by google id
    async findUserByGoogleId(googleId: string): Promise<IUser | null> {
        return await this.model.findOne({ googleId: googleId })
    }

    //find user by facebook id
    async findUserByFacebookId(facebookId: string): Promise<IUser | null> {
        return await this.model.findOne({ facebookId: facebookId })
    }

    //save new user
    async saveUser(userData: Partial<IUser>): Promise<IUser> {
        return await this.model.create(userData)
    }


    //change password 
    async chagePassword(id: string, newPassword: string): Promise<IUser | null> {
        return await this.model.findByIdAndUpdate(id, { password: newPassword }, { new: true })
    }

    //find all users
    async fetchAllUsers(page: number, limit: number, search: string): Promise<{ users: Partial<IUser>[], total: number }> {
        const query: FilterQuery<IUser> = {
            role: 'resident'
        }
        if (search.trim()) {
            const regex = new RegExp(search, 'i');
            query.$or = [
                { firstName: regex },
                { lastName: regex },
                { email: regex },
                { mobile: regex },
                { 'address.city': regex },
                { 'address.district': regex },
                {
                    $expr: {
                      $regexMatch: {
                        input: { $concat: ['$firstName', ' ', '$lastName'] },
                        regex: search,
                        options: 'i'
                      }
                    }
                  }
            ];
        }

        const skip = (page - 1) * limit
        const [users, total] = await Promise.all([
            userModel.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            userModel.countDocuments({ role: 'resident' })
        ]);
        return { users, total };
    }

    //toggle users status block or unblok
    async toggleUserStatus(userId: string): Promise<void> {
        const user = await this.findUserById(userId)

        if (!user) {
            throw new notFound('user not found')
        }

        const status = user.isBlock
        await this.model.findByIdAndUpdate(userId, {
            $set: {
                isBlock: !status
            }
        }, { new: true })
    }

    //find collectors from particlar distance
    async findNearCollectorsId(location: locationDto, maxDistance: number): Promise<{ _id: string, firstName: string, lastName: string }[] | null> {
        try {
            return await this.model.find({
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