
import {hash, compare} from 'bcrypt'
import { IHashingService } from '../../interfaces/services/IHashingService';
import {  injectable } from 'inversify';

@injectable()
export class hashingService implements IHashingService {
    private readonly saltRound = 10

    async hash(data: string): Promise<string> {
        return hash(data, this.saltRound)
    }

    async compare(data: string, encrypted: string): Promise<boolean> {
        return compare(data, encrypted)
    }
}