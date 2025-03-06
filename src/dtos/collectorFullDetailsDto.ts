import { ICollector } from "../domain/entities/collector";
import { IUser } from "../domain/entities/user";

export interface collectorFullDetailsDto extends IUser, ICollector {}