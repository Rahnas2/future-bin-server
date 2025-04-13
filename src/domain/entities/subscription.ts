export interface Subscription {
    _id?: string,
    name: string,
    price: string,
    description: string,
    features: string[],
    frequency: "daily" | "weekly" | "monthly",
    totalPickups: number
}