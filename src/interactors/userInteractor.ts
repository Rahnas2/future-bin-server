import { inject, injectable } from "inversify";
import { IUserInteractor } from "../interfaces/interactors/IUserInteractor";
import { INTERFACE_TYPE } from "../utils/appConst";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { Forbidden, notFound } from "../domain/errors";
import { IUser } from "../domain/entities/user";
import { ICloudinaryService } from "../interfaces/services/ICloudinaryService";
import { IHashingService } from "../interfaces/services/IHashingService";
import { IPickupRequestRepository } from "../interfaces/repositories/IPickupRequestRepository";
import { ITransactionRepository } from "../interfaces/repositories/ITransactionReporisoty";
import { ITransactionDocument } from "../interfaces/documents/ITransactionDocument";

@injectable()
export class userInteractor implements IUserInteractor {

    constructor(@inject(INTERFACE_TYPE.userRepository) private userRepository: IUserRepository,
        @inject(INTERFACE_TYPE.cloudinaryService) private cloudinaryService: ICloudinaryService,
        @inject(INTERFACE_TYPE.hashingService) private hashingService: IHashingService,
        @inject(INTERFACE_TYPE.transactionRepository) private transactionRepository: ITransactionRepository) { }

    async getUserProfile(_id: string) {
        const user = await this.userRepository.findById(_id)

        if (!user) {
            throw new notFound('user not found')
        }

        return user
    }

    async editUserProfile(id: string, data: Partial<IUser>, file?: Express.Multer.File): Promise<IUser> {

        let image = null
        if (file) {
            image = await this.cloudinaryService.uploadImage(file.buffer, 'profileImage')
        }

        const updatedPayload = { ...data }

        if (image) {
            updatedPayload.image = image
        }
        return await this.userRepository.findByIdAndUpdate(id, updatedPayload)

    }

    async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
        const user = await this.userRepository.findUserById(id)

        if (!user) {
            throw new notFound('user not found')
        }

        if (!user.password) {
            throw new notFound('password not found in db')
        }

        const passCheck = await this.hashingService.compare(currentPassword, user.password)

        if (!passCheck) {
            throw new Forbidden('current password is incorrect')
        }

        const password = await this.hashingService.hash(newPassword)

        await this.userRepository.chagePassword(id, password)

    }

    // async getTransactionHistory(userId: string, role: 'resident' | 'collector' | 'admin'): Promise<ITransactionDocument []> {
    //     if(role === 'admin'){
    //         return await this.transactionRepository.findAll(1, 10)
    //     }
    //     return await this.transactionRepository.finByUserId(userId)
    // }

}