export interface Review {
    userId: string,
    type: 'collector' | 'app';
    rating: number;
    comment?: string;
    collectorId?: string
    createdAt: Date;
}