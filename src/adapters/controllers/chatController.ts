import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IChatInteractor } from "../../interfaces/interactors/IChatInteractor";
import { AuthRequest } from "../../dtos/authRequestDto";
import { NextFunction, Response, Request } from "express";
import { stringify } from "querystring";

@injectable()
export class chatController {

    constructor(@inject(INTERFACE_TYPE.chatInteractor) private chatInteractor: IChatInteractor) {}

    onGetChatList = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req._id
            console.log('user id ', userId)
            if(!userId) {
                res.status(400).json({message: 'user id is missing'})
                return
            }

            const chatList = await this.chatInteractor.getChatList(userId)

            res.status(200).json({message: 'success', chatList})
        } catch (error) {
            next(error)
        }
    }

    onSentMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const senderId = req._id;
            const { receiverId, message } = req.body;

            if (!senderId || !receiverId || !message) {
                res.status(400).json({ message: 'Missing required fields' });
                return
            }

            await this.chatInteractor.sentMessage(senderId, receiverId, message);
            res.status(200).json({ message: 'Message sent successfully' });
        } catch (error) {
            next(error);
        }
    };

    onGetMessagesBetweenTwoUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId1 = req._id
            const { userId2 } = req.query

            if(!userId1 || !userId2){
                res.status(400).json({message: 'missing required fields'})
                return
            }
            const messages = await this.chatInteractor.getMessagesBetweenTwoUser(userId1, userId2 as string);
            res.status(200).json({ messages });
        } catch (error) {
            next(error);
        }
    };

    onGetMessageHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { chatId } = req.query

            if(!chatId){
                res.status(400).json({message: 'missing required fields'})
                return
            }
            const messages = await this.chatInteractor.getMessageHistory(chatId as string);
            res.status(200).json({ messages });
        } catch (error) {
            next(error);
        }
    };


}