import { ICollector } from "../../domain/entities/collector";
import { ICollectorDocument } from "../documents/ICollectorDocument";

export interface ICollectorInteractor {
    patchUpdate(id: string, data: Partial<ICollector>): Promise<ICollectorDocument>

    generateOnboardingLink(stripeAccountId: string): Promise<string>
}