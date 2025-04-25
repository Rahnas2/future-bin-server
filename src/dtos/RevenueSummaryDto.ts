export interface revenueSummaryDto {
    type:   'credited' | 'refunded' | 'transfered',
    total: number;
}