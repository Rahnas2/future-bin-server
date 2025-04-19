import { Document } from "mongoose";
import { transaction } from "../../domain/entities/transaction";

export interface ITransactionDocument extends transaction, Document{

}