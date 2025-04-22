import { authResponseDto } from "../../dtos/authResponseDto";
import { requestAnalyticsDto } from "../../dtos/requestAnalyticsDto";
import { summaryDto } from "../../dtos/summaryDto";

export interface IAdminteractor{
    login(email: string, password: string, secret: string): Promise<authResponseDto>

    getSummary(): Promise<summaryDto>

    analytics(from: string, to: string): Promise<requestAnalyticsDto>
}