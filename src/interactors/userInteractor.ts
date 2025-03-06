import { inject, injectable } from "inversify";
import { IUserInteractor } from "../interfaces/interactors/IUserInteractor";
import { INTERFACE_TYPE } from "../utils/appConst";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { notFound } from "../domain/errors";
import { IUser } from "../domain/entities/user";
import { ICloudinaryService } from "../interfaces/services/ICloudinaryService";

@injectable()
export class userInteractor implements IUserInteractor {

    constructor(@inject(INTERFACE_TYPE.userRepository) private userRepository: IUserRepository,
        @inject(INTERFACE_TYPE.cloudinaryService) private cloudinaryService: ICloudinaryService) { }

    async getUserProfile(_id: string) {
        const user = await this.userRepository.findUserById(_id)

        if (!user) {
            throw new notFound('user not found')
        }

        return user
    }

    async editUserProfile(data: Partial<IUser>, file?: Express.Multer.File): Promise<IUser> {
        console.log('intersepter files ', file)
        
     
        let image = null
        if(file) {
            image = await this.cloudinaryService.uploadImage(file.buffer, 'profileImage')
        }

        const updatedPayload = {...data}

        if(image) {
            updatedPayload.image = image
        }
        return await this.userRepository.updateUser(updatedPayload)
    
    }
}