import { Model, Document } from "mongoose";
import { IBaseRepository } from "../../../interfaces/repositories/IBaseRepository";
import { DatabaseError, notFound } from "../../../domain/errors";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async findById(id: string): Promise<T> {
        try {
            const response = await this.model.findById(id)
            if (!response) throw new notFound('not found')

            return response
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }

    //find documents by user id
    async finByUserId(userId: string): Promise<T[]> {
        try {
            const response = await this.model.find({userId: userId})
            return response
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }

    async findAll(): Promise<T[]> {
        try {
            const response = await this.model.find()

            return response
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }

    async create(data: Partial<T>): Promise<T> {
        try {
            const result = await this.model.create(data)
            return result
        } catch (error) {
            throw new DatabaseError('data base error ->' + error)
        }
    }

    async findByIdAndUpdate(id: string, data: Partial<T>): Promise<T> {
        try {
            const result = await this.model.findByIdAndUpdate(id, {$set: data}, {new: true})
            if(!result){
                throw new notFound('not found');
            }
            return result
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }

    async deleteById(id: string): Promise<boolean> {
        try {
            const result  = await this.model.findByIdAndDelete(id)
            return !!result
        } catch (error) {
            throw new DatabaseError('data base error') 
        }
    }
}