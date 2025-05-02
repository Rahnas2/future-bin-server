import { onDemandWasteTypeDto } from "../../dtos/onDemandWasteTypeDto";
import { pickupRequestRefundDto } from "../../dtos/pickupRequestRefundDto";
import { requestCancellationDto } from "../../dtos/requestCancellationDto";

export interface BasePickupRequest<T extends 'on-demand' | 'subscription'> {
    userId: string;
    name: string;
    mobile: string;
    email: string;
    type: T;
    status: string;
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
    collectorId?: string;
    collectorName?: string;
    userImage?: string,
    collectorImage?: string,
    collectorEmail?: string,
    collectorMobile?: number,
    cancellation?: requestCancellationDto
    refund?:  pickupRequestRefundDto
    paymentStatus: string;
    totalAmount: number;
    paidAmount: number;
    paymentIntentId?: string;
    assignedAt?: Date;
    completedAt?: Date;
    createdAt?: Date;
}

export interface OnDemandPickupRequest extends BasePickupRequest<'on-demand'> {
    wasteTypes: onDemandWasteTypeDto[];
    totalWeight: number;
}

export interface SubscriptionPickupRequest extends BasePickupRequest<'subscription'> {
    subscription: {
        planId: string;
        name: string;
        features: string[]
        totalPickups: number;
        completedPickups: number;
        startDate?: Date;
        endDate?: Date;
      };
}     

export type PickupRequest = OnDemandPickupRequest | SubscriptionPickupRequest;
