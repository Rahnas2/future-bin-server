import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils/appConst";
import { pickupRequestRepository } from "../infrastructure/database/repositories/pickupRequestRepository";
import { IPickupRequestRepository } from "../interfaces/repositories/IPickupRequestRepository";
import { IPickupRequestInteractor } from "../interfaces/interactors/IPickupRequestInteractor";
import { PickupRequest } from "../domain/entities/picupRequest";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { DatabaseError, notFound } from "../domain/errors";
import { ICollectorRepository } from "../interfaces/repositories/ICollectorRepository";
import { ISocketService } from "../interfaces/services/ISocketService";
import { locationDto } from "../dtos/locationDto";


@injectable()
export class pickupRequestInteractor implements IPickupRequestInteractor {
    constructor(@inject(INTERFACE_TYPE.pickupRequestRepository) private pickupRequestRepository: IPickupRequestRepository,
        @inject(INTERFACE_TYPE.userRepository) private userRepository: IUserRepository,
        @inject(INTERFACE_TYPE.collectorRepoitory) private collectorRepoitory: ICollectorRepository,
        @inject(INTERFACE_TYPE.SocketService) private SocketService: ISocketService
    ) { }

    async createPickupRequest(requestData: PickupRequest): Promise<void> {

        //request location 
        const requestLocation = requestData.address.location

        // Find within 5km radius
        const users = await this.userRepository.findNearCollectorsId(requestLocation, 5000)
        //if no collectors found
        if (!users || !users.length) {
            throw new notFound("Sorry No nearby collectors found")
        }

        //extract id's from collectors array
        const usersIds = users.map(collector => collector._id);

        //find active collectors from nearby collectors
        const activeCollectorsId = await this.collectorRepoitory.findActiveCollectorsByUserId(usersIds)

        if (!activeCollectorsId || !activeCollectorsId.length) {
            throw new notFound("Sorry no collectors are active in your area")
        }

        //create request and store _id
        const requestId = await this.pickupRequestRepository.createRequest(requestData)

        // Assigning request notification to near collectors
        activeCollectorsId.forEach(collector => {
            this.SocketService.sentNotification(collector.userId.toString(), 'new-request', requestId)
        });

    }

    async getNearPickupRequestById(id: string): Promise<PickupRequest[] | []> {

        const user = await this.userRepository.findUserById(id)
        if (!user) {
            throw new notFound('user not found')
        }

        const location = user.address.location

        return await this.pickupRequestRepository.findPendingRequestsWithLocation(location, 5000)

    }

    async getPickupRequestById(id: string): Promise<PickupRequest> {
        const request =  await this.pickupRequestRepository.findRequestById(id)

        if(!request){
            throw new notFound('request not found')
        }
        return request
    }

}