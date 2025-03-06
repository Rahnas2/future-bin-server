

export interface IUser{
    _id?: string
    firstName: string
    lastName: string
    email: string
    mobile: string
    googleId?: string | null
    password: string | null
    role: string
    image?: string | null
    address: {
        street: string
        houseNo: string
        district: string
        city: string
        pincode: number
        location: {
            type: 'Point';
            coordinates: [number, number]
        };
    }
    isBlock?: boolean
    subscriptionPlanId?: string,
    // createdAt: Date,
    // updatedAt: Date
}