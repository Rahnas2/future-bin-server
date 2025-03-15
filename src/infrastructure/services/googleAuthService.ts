
import { google } from 'googleapis'
import { injectable } from 'inversify'

@injectable()
export class googleAuthService {
    private oath2Client
    constructor(){
        this.oath2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'postmessage'
        )
    }

    async getTokens(code: string) {
        const { tokens } = await this.oath2Client.getToken(code)
        this.oath2Client.setCredentials(tokens)
        return tokens
    }
}