import { inject, injectable } from "inversify";
import { ICollectorInteractor } from "../interfaces/interactors/ICollectorInteractor";
import { ICollector } from "../domain/entities/collector";
import { ICollectorDocument } from "../interfaces/documents/ICollectorDocument";
import { INTERFACE_TYPE } from "../utils/appConst";
import { ICollectorRepository } from "../interfaces/repositories/ICollectorRepository";

@injectable()
export class collectorInteractor implements ICollectorInteractor {

    constructor(@inject(INTERFACE_TYPE.collectorRepoitory) private collectorRepoitory: ICollectorRepository) { }
    async patchUpdate(id: string, data: Partial<ICollector>): Promise<ICollectorDocument> {
        return await this.collectorRepoitory.findByIdAndUpdate(id, data)
    }
}