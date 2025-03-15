import { inject, injectable } from 'inversify';
import { IRedisRepository } from '../../../interfaces/repositories/IRedisRepository';
import { INTERFACE_TYPE } from '../../../utils/appConst';

@injectable()
export class socketRepository {

    constructor(
        @inject(INTERFACE_TYPE.redisRepository) private redisRepository: IRedisRepository) { }

    async getSocketId(_id: string): Promise<string | null> {
        return this.redisRepository.get<string>(_id);
    }
}