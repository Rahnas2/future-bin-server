export interface IBaseRepository<T> {
    findById(id: string): Promise<T>
    findAll(): Promise<T[]>
    create(data: Partial<T>): Promise<T>
    findByIdAndUpdate(id: string, data: Partial<T>): Promise<T>
    deleteById(id: string): Promise<boolean>
}