import { ObjectId } from 'mongodb';

export interface Admin {
    _id: string,
    email: string,
    password: string
}
