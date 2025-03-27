import { IWasteTypeDocument } from "../documents/IWasteTypeDocument";
import { IBaseRepository } from "./IBaseRepository";

export interface IWasteTypeRepository extends IBaseRepository<IWasteTypeDocument> {
    findWasteTypeByName(name: string): Promise<IWasteTypeDocument | null>
}