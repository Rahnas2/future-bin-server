export interface IFacebookAuthService {
    getUserByFacebookIdAndAccessToken(userId: string, token: string): Promise<any>
}