import Stripe from "stripe";
import { ICollector } from "../../domain/entities/collector";
import { collectorEarningsSummaryDto } from "../../dtos/collectorEarningsSummaryDto";
import { ICollectorDocument } from "../documents/ICollectorDocument";

export interface ICollectorInteractor {
    patchUpdate(id: string, data: Partial<ICollector>): Promise<ICollectorDocument>

    generateOnboardingLink(stripeAccountId: string): Promise<string>

    getMyEarnings(collectorId: string): Promise<collectorEarningsSummaryDto>

    withdrawBalance(collectorId: string, amount: number): Promise<Stripe.Payout>
}