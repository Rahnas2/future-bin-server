import { injectable } from "inversify";
import { ITransactionDocument } from "../../../interfaces/documents/ITransactionDocument";
import { ITransactionRepository } from "../../../interfaces/repositories/ITransactionReporisoty";
import { BaseRepository } from "./baseRepository";
import transactionModel from "../models/transaction";

@injectable()
export class transactionRepository extends BaseRepository<ITransactionDocument> implements ITransactionRepository{
    constructor(){
        super(transactionModel)
    }
}