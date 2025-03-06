import { ObjectId } from 'mongodb';

export interface Admin {
    _id: ObjectId,
    email: string,
    password: string
}
