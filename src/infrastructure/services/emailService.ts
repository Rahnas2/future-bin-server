import { IEmailService } from "../../interfaces/services/IEmailService";
import { registerRequestApproved, registerRequestRejected } from "../../utils/emailContents";
import transporter from "../config/nodemailerConfig";
import { injectable } from "inversify";

@injectable()
export class emailService implements IEmailService {
    async sentMail(email: string, name: string, type: string): Promise<void> {
        const mailOption = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: type === 'approved' ? 'Your Collector Registration Has Been Approved!' : 'Your Collector Registration Request',
            html: type === 'approved' ? registerRequestApproved(name) : registerRequestRejected(name)
        }
        try {
            await transporter.sendMail(mailOption)
        } catch (error) {
            console.log('error ', error)
        }
    }
}