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

    async findOne(filter: Partial<Record<keyof T, any>>): Promise<T | null> {
        try {
            const response = await this.model.findOne(filter);
            return response;
        } catch (error) {
            throw new DatabaseError('database error');
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

    //find all documents
    async findAll(page: number, limit: number): Promise<T[]> {
        try {
            const skip = (page - 1) * limit
            const response = await this.model.find().skip(skip).limit(limit).sort({createdAt: -1})
            return response
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }

    async totalDocumentCount(): Promise<number> {
        try {
            return this.model.countDocuments()
        } catch (error) {
            throw new DatabaseError('data base error ->' + error)
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

    //create multiple document 
    async createMany(data: Partial<T>[]): Promise<void> {
        try {
            const result = await this.model.insertMany(data);
            console.log('result of insert many ', result)
        } catch (error) {
            throw new DatabaseError('Database error -> ' + error);
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