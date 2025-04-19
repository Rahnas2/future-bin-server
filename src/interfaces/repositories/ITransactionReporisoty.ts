import { ITransactionDocument } from "../documents/ITransactionDocument";
import { IBaseRepository } from "./IBaseRepository";

export interface ITransactionRepository extends IBaseRepository<ITransactionDocument>{}