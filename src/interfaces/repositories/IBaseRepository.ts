export interface IBaseRepository<T> {
    findById(id: string): Promise<T>
    findOne(filter: Partial<Record<keyof T, any>>): Promise< T | null >
    finByUserId(userId: string): Promise<T[]>
    findAll(page: number, limit: number): Promise<T[]>
    totalDocumentCount(): Promise<number>

    create(data: Partial<T>): Promise<T>
    createMany(data: Partial<T> []): Promise<void>
    
    findByIdAndUpdate(id: string, data: Partial<T>): Promise<T>
    deleteById(id: string): Promise<boolean>
}