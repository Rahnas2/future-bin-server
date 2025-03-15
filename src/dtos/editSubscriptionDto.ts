export interface editSubscriptionDto {
    updatedData: {
        name?: string,
        price?: string,
        description?: string
    },
    features?: string[]
}