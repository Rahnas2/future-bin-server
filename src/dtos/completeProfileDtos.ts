export interface completeProfileDto {
    email: string,
    mobile: string,
    address: {
        street: string;
        houseNo: string;
        district: string;
        city: string;
        pincode: number;
        location: {
            type: 'Point';
            coordinates: [number, number];
        };
    };
    image?: string,
    idCard?:{
        front: string,
        back: string
    },
    vehicleDetails?: {
        type: string;
        registrationNumber: string;
        image: string;
    };
}