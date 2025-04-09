export interface requestCancellationDto {
    cancelledBy: "resident" | "collector";
    reason: string;
    description?: string;
    proof?: string;
}