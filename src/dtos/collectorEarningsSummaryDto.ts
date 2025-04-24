export interface collectorEarningsSummaryDto {
    totalEarnings: number,
    onDemandEarnings: number,
    subscriptionEarnings: number,
    lastPaymentDate: string | null,
    walletBalance: number
}