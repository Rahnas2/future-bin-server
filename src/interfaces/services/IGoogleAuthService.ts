export interface IGoogleAuthService {
    getTokens(code: string): Promise<any>
}