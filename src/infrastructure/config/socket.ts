import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from '../../utils/appConst';
import { IRedisRepository } from '../../interfaces/repositories/IRedisRepository';
import { IMessageRepository } from '../../interfaces/repositories/IMessageRepository';
import { IChatRepository } from '../../interfaces/repositories/IChatRepository';

@injectable()
export class SocketConfig {
    private io: Server | null = null;

    constructor(
        @inject(INTERFACE_TYPE.redisRepository) private redisRepository: IRedisRepository,
        @inject(INTERFACE_TYPE.messagRepository) private messagRepository: IMessageRepository,
        @inject(INTERFACE_TYPE.chatRepository) private chatRepository: IChatRepository) { }

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
                socket.join(_id);
                console.log(`Mapped ${_id} to socket ${socket.id} image`);
            }

            socket.on('send message', async ({ receiverId, message, isImage }) => {
                console.log(`New message  to ${receiverId}: ${message}  ${isImage}`);

                //find isolated chat room  between user and collector
                let chat = await this.chatRepository.findSingleChat(_id, receiverId)

                //if there is no chat create new else update last message
                if (!chat) {
                    chat = await this.chatRepository.create({ participants: [_id, receiverId], lastMessage: { message, senderId: _id, isImage } })
                } else {
                    await this.chatRepository.findByIdAndUpdate(chat._id.toString(), { lastMessage: { message, senderId: _id, isImage } })
                }


                // Store message in MongoDB
                const newMessage = await this.messagRepository.create({ chatId: chat._id.toString(), senderId: _id, receiverId, message, isImage });

                // Emit message to the receiver’s room
                this.io?.to(receiverId).emit('receive message', newMessage);

                // Get updated chat for BOTH participants
                const updatedChatForReceiver = await this.chatRepository.findSingleChatInDetail(chat._id.toString(), receiverId);
                const updatedChatForSender = await this.chatRepository.findSingleChatInDetail(chat._id.toString(), _id);
                console.log('chat for sender ', updatedChatForSender)

                // Emit to correct participants
                this.io?.to(receiverId).emit('chat update', updatedChatForReceiver);
                this.io?.to(_id).emit('chat update', updatedChatForSender);
            });

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