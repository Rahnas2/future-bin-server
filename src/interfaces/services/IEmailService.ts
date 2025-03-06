export interface IEmailService {
    sentMail(email: string, name: string, type: string): Promise<void>
}