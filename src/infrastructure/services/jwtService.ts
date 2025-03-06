import { injectable } from 'inversify'
import jwt from 'jsonwebtoken'
import { unAuthorized } from '../../domain/errors'

@injectable()
export class jwtService {
    private ACCESS_SECRET: string
    private REFRESH_SECRET: string

    constructor() {
        this.ACCESS_SECRET = process.env.ACCESS_JWT_SECRET as string
        this.REFRESH_SECRET = process.env.REFRESH_JWT_SECRET as string
    }

    generateAccessToken(payload: object) {
        return jwt.sign(payload, this.ACCESS_SECRET, { expiresIn: '1h' })
    }

    generateRefreshToken(payload: object) {
        return jwt.sign(payload, this.REFRESH_SECRET, { expiresIn: '24h' })
    }

    verifyAccessToken(accessToken: string) {
        try {
            return jwt.verify(accessToken, this.ACCESS_SECRET)
        } catch (error) {
            throw new unAuthorized('invalid or expired token')
        }
    }

    verifyRefreshToken(refreshToken: string) {
        try {
            return jwt.verify(refreshToken, this.REFRESH_SECRET)
        } catch (error) {
            throw new unAuthorized('invalid or expired token')
        }
    }


}