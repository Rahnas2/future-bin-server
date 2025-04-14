export interface Subscription {
    _id?: string,
    name: string,
    price: string,
    description: string,
    totalPickups: number,
    frequency: "daily" | "weekly" | "monthly",
    features: string[],
}