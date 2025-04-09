import { inject, injectable } from 'inversify';
import { Server } from 'socket.io';
import { INTERFACE_TYPE } from '../../utils/appConst';
import { ISocketRepository } from '../../interfaces/services/ISocketRepository';
import { SocketConfig } from '../config/socket';

@injectable()
export class SocketService {

    constructor(
        @inject(INTERFACE_TYPE.socketRepository) private socketRepository: ISocketRepository,
        @inject(SocketConfig) private socketConfig: SocketConfig) { }

    async sentNotification(id: string, event: string, data: any) {
        // const socketId = await this.socketRepository.getSocketId(_id);
        // console.log('socket id ', socketId)
        // if (socketId) {
            this.socketConfig.getIO().to(id).emit(event, data);
        // }
    }

    

    
}