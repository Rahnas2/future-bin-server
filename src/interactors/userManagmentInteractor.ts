import { inject, injectable } from "inversify";
import { IUserManagmentInteractor } from "../interfaces/interactors/IUserManagmentInteractor";
import { INTERFACE_TYPE } from "../utils/appConst";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { IUser } from "../domain/entities/user";
import { InvalidCredentialsError, notFound } from "../domain/errors";
import { ICollectorRepository } from "../interfaces/repositories/ICollectorRepository";
import { collectorFullDetailsDto } from "../dtos/collectorFullDetailsDto";
import { IEmailService } from "../interfaces/services/IEmailService";

@injectable()
export class userManagmentInteractor implements IUserManagmentInteractor {

    constructor(@inject(INTERFACE_TYPE.userRepository) private userRepository: IUserRepository,
        @inject(INTERFACE_TYPE.collectorRepoitory) private collectorRepository: ICollectorRepository,
        @inject(INTERFACE_TYPE.emailService) private emailService: IEmailService
    ) { }


    async fetchUsers(page: number, limit: number): Promise<{users: Partial<IUser>[], total: number}> {
        return await this.userRepository.fetchAllUsers(page, limit)
    }

    async fetchCollectors(approvedStatus: string, page: number, limit: number): Promise<{collectors: Partial<collectorFullDetailsDto>[], total: number}> {
        const result =  await this.collectorRepository.findAllCollectorsWithStatus(approvedStatus, page, limit)
        console.log('result ', result)
        return result
    }

    async fetchUserDetail(userId: string): Promise<IUser> {
        const user = await this.userRepository.findById(userId)

        if (!user) {
            throw new notFound('user not found')
        }
        user['password'] = null

        return user
    }

    async toggleStatus(userId: string) {
        await this.userRepository.toggleUserStatus(userId)
    }

    async fetchCollectorDetails(userId: string): Promise<collectorFullDetailsDto> {
        const user = await this.userRepository.findById(userId)

        if(!user){
            throw new notFound('user not found')
        }

        if(user?.role !== 'collector') {
            throw new InvalidCredentialsError('invalid role')
        }

        const collector = await this.collectorRepository.findCollectorDetails(userId)
        if(!collector) {
            throw new notFound('collector not found')
        }

        collector['password'] = null

        return collector
    }


    async acceptRequest(collectorId: string, name: string, email: string): Promise<void> {
        await this.collectorRepository.updateCollectorRequestStatus(collectorId, 'accepted')
        await this.emailService.sentMail(email, name, 'approved')
    }

    async rejectRequest(collectorId: string, name: string, email: string): Promise<void> {
        await this.collectorRepository.updateCollectorRequestStatus(collectorId, 'rejected')
        await this.emailService.sentMail(email, name, 'rejected')
    }
}