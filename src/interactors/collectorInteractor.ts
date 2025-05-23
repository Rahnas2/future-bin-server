import { inject, injectable } from "inversify";
import { ICollectorInteractor } from "../interfaces/interactors/ICollectorInteractor";
import { ICollector } from "../domain/entities/collector";
import { ICollectorDocument } from "../interfaces/documents/ICollectorDocument";
import { INTERFACE_TYPE } from "../utils/appConst";
import { ICollectorRepository } from "../interfaces/repositories/ICollectorRepository";
import { IStripService } from "../interfaces/services/IStripService";
import { collectorEarningsSummaryDto } from "../dtos/collectorEarningsSummaryDto";
import { ITransactionRepository } from "../interfaces/repositories/ITransactionReporisoty";
import { notFound } from "../domain/errors";
import Stripe from "stripe";

@injectable()
export class collectorInteractor implements ICollectorInteractor {

    constructor(@inject(INTERFACE_TYPE.collectorRepoitory) private collectorRepoitory: ICollectorRepository,
        @inject(INTERFACE_TYPE.stripeService) private stripeService: IStripService,
        @inject(INTERFACE_TYPE.transactionRepository) private transactionRepository: ITransactionRepository
    ) { }


    async patchUpdate(id: string, data: Partial<ICollector>): Promise<ICollectorDocument> {
        return await this.collectorRepoitory.findByIdAndUpdate(id, data)
    }

    async generateOnboardingLink(stripeAccountId: string): Promise<string> {
        return await this.stripeService.createOnboardingLink(stripeAccountId)
    }

    async getMyEarnings(collectorId: string): Promise<collectorEarningsSummaryDto> {

        const totalEarningsAgg = await this.transactionRepository.findTotalEarningsForCollector(collectorId);
        console.log('total earnings ', totalEarningsAgg)
        const totalEarnings = totalEarningsAgg?.[0]?.totalEarnings || 0;

        const typeWiseAgg = await this.transactionRepository.findCollectorEarningsByPickupType(collectorId);
        let onDemandEarnings = 0;
        let subscriptionEarnings = 0;

        for (const item of typeWiseAgg) {
            if (item._id === 'on-demand') onDemandEarnings = item.totalEarnings;
            if (item._id === 'subscription') subscriptionEarnings = item.totalEarnings;
        }

        const lastCredit = await this.transactionRepository.findLatestTransfer(collectorId)
        const lastPaymentDate = lastCredit?.createdAt?.toISOString() || null;

        const collector = await this.collectorRepoitory.findOne({ userId: collectorId })
        if (!collector || !collector.stripeAccountId) {
            throw new notFound('stripe id is missing')
        }

        const balance = await this.stripeService.checkBalance(collector.stripeAccountId);
        console.log('balance here ', balance)
        const availableBalance = balance.available[0]?.amount / 100 || 0
        const pendingBalance = balance.pending[0]?.amount / 100 || 0

        let walletBalance = availableBalance;
        if (pendingBalance < 0) {
            walletBalance = availableBalance + pendingBalance
        }

        return {
            totalEarnings,
            onDemandEarnings,
            subscriptionEarnings,
            lastPaymentDate,
            walletBalance,
        }

    }

    async withdrawBalance(collectorId: string, amount: number): Promise<Stripe.Payout> {

        const collector = await this.collectorRepoitory.findOne({ userId: collectorId })

        if (!collector || !collector.stripeAccountId) {
            throw new notFound('collector or stirpe id is missing ')

        }
        const response =  await this.stripeService.createPayout(collector.stripeAccountId, amount, collectorId)
        console.log('response ', response)

        return response
    }
}