import { JwtPayload } from "jsonwebtoken";
import { authResponseDto } from "../../dtos/authResponseDto";
import { basicInfoDto } from "../../dtos/basicInfoDto";
import { completeProfileDto } from "../../dtos/completeProfileDtos";
import { TokenResponseDto } from "../../dtos/tokenResponseDto";

export interface IAuthInteractor {
    basicInfo(userData: basicInfoDto): Promise<void>
    verifyOtp(email: string, otp: string): Promise<boolean>
    resentOtp(email: string): Promise<void>
    updateRole(email: string, role: string): void
    completeProfile(data: completeProfileDto, files: Record<string, Express.Multer.File[]>): Promise<authResponseDto>
    login(data: object): Promise<authResponseDto>
    googleLogin(code: string): Promise<string>
    refreshToken(refreshToken: string): Promise<TokenResponseDto>
}