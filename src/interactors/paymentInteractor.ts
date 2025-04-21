import { inject, injectable } from "inversify";
import { IPaymentInteractor } from "../interfaces/interactors/IPaymentInteractor";
import { INTERFACE_TYPE } from "../utils/appConst";
import { IStripService } from "../interfaces/services/IStripService";
import { IPickupRequestRepository } from "../interfaces/repositories/IPickupRequestRepository";
import { notFound } from "../domain/errors";

@injectable()
export class paymentInteractor implements IPaymentInteractor {

    constructor(@inject(INTERFACE_TYPE.stripeService) private stripeService: IStripService,
        @inject(INTERFACE_TYPE.pickupRequestRepository) private pickupRequestRepository: IPickupRequestRepository) { }

    async confirmPayment() {

    }

    async getClientSecret(requestId: string): Promise<string> {
        const pickupRequest = await this.pickupRequestRepository.findById(requestId)

        if(!pickupRequest.paymentIntentId){
            throw new notFound('payment id not found in the request ')
        }

        const response = await this.stripeService.retrievePaymentIntent(pickupRequest.paymentIntentId)

        if(!response.client_secret) {
            throw new notFound('client id not found')
        }

        return response.client_secret
    }
}