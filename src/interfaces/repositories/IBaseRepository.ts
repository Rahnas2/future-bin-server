import mongoose, { FilterQuery, UpdateQuery } from "mongoose"

export interface IBaseRepository<T> {
    findById(id: string): Promise<T>
    findOne(filter: Partial<Record<keyof T, any>>): Promise< T | null >
    finByUserId(userId: string): Promise<T[]>
    findAll(page: number, limit: number, search?:string): Promise<T[]>
    totalDocumentCount(): Promise<number>
    countFilterDocument(data: FilterQuery<T>): Promise<number>

    create(data: Partial<T>): Promise<T>
    createMany(data: Partial<T> []): Promise<void>
    
    findByIdAndUpdate(id: string, data: Partial<T>): Promise<T>

    updateManay(data: FilterQuery<T>, updatedData: UpdateQuery<T>): Promise<mongoose.UpdateResult>

    deleteById(id: string): Promise<boolean>
}