import { JwtPayload } from "jsonwebtoken"

export interface IJwtService {
    generateAccessToken(payload: object): string
    generateRefreshToken(payload: object): string
    verifyAccessToken(accessToken: string): JwtPayload
    verifyRefreshToken(refreshToken: string): JwtPayload
}