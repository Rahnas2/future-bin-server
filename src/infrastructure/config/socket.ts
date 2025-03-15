import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from '../../utils/appConst';
import { IRedisRepository } from '../../interfaces/repositories/IRedisRepository';

@injectable()
export class SocketConfig {
    private io: Server | null = null; 

    constructor(
        @inject(INTERFACE_TYPE.redisRepository) private redisRepository: IRedisRepository) { }

    initializeSocket(server: HTTPServer) {
        this.io = new Server(server, {
            cors: {
                origin: 'http://localhost:5173',
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });

        this.io.on('connection', (socket) => {
            console.log(`Socket connected: ${socket.id}`);

            const { _id } = socket.handshake.auth;

            // Store socket ID in Redis
            if (_id) {
                this.redisRepository.set(_id, socket.id);
                console.log(`Mapped ${_id} to socket ${socket.id}`);
            }

            // Handle disconnection
            socket.on('disconnect', async () => {
                console.log(`Socket disconnected: ${socket.id}`);

                if (_id) {
                    await this.redisRepository.delete(_id);
                    console.log(`Removed mapping for ${_id}`);
                }
            });
        });

        return this.io;
    }

    getIO() {
        if (!this.io) {
            throw new Error('Socket.io is not initialized!');
        }
        return this.io;
    }
}