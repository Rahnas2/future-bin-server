import { inject, injectable } from "inversify";
import { InvalidCredentialsError } from "../domain/errors";
import { INTERFACE_TYPE } from "../utils/appConst";
import { IAdminRepository } from "../interfaces/repositories/IAdminRepository";
import { IHashingService } from "../interfaces/services/IHashingService";
import { IJwtService } from "../interfaces/services/IJwtService";
import { IAdminteractor } from "../interfaces/interactors/IAdminInteractor";
import { summaryDto } from "../dtos/summaryDto";
import { IPickupRequestRepository } from "../interfaces/repositories/IPickupRequestRepository";
import { requestAnalyticsDto } from "../dtos/requestAnalyticsDto";

// @injectable()
export class adminInteractor implements IAdminteractor {

    constructor(@inject(INTERFACE_TYPE.adminRepository) private adminRepository: IAdminRepository,
        @inject(INTERFACE_TYPE.hashingService) private hashingService: IHashingService,
        @inject(INTERFACE_TYPE.jwtService) private jwtService: IJwtService,
        @inject(INTERFACE_TYPE.pickupRequestRepository) private pickupRequestRepository: IPickupRequestRepository
    ) { }

    async login(email: string, password: string, secret: string) {

        if (process.env.ADMIN_SECRET !== secret) {
            throw new InvalidCredentialsError('invalid secret')
        }

        const admin = await this.adminRepository.findAdminByEmail(email)

        if (!admin) {
            throw new InvalidCredentialsError('invalid credential')
        }

        //compare password
        const result = await this.hashingService.compare(password, admin.password)

        //check password is wrong
        if (!result) {
            throw new InvalidCredentialsError('invalid credentail')
        }

        //generate access & refresh token
        const accessToken = this.jwtService.generateAccessToken({ _id: admin._id, role: 'admin' })
        const refreshToken = this.jwtService.generateRefreshToken({ _id: admin._id, role: 'admin' })

        return { accessToken, refreshToken, role: 'admin' }

    }

    async getSummary(): Promise<summaryDto> {
        const statusCounts = await this.pickupRequestRepository.getStatusCounts()

        return {
            totalRequests: statusCounts.reduce((acc, s) => acc + s.count, 0),
            pending: statusCounts.find(s => s.status === "pending")?.count || 0,
            accepted: statusCounts.find(s => s.status === "accepted")?.count || 0,
            confirmed: statusCounts.find(s => s.status === "confirmed")?.count || 0,
            completed: statusCounts.find(s => s.status === "completed")?.count || 0,
            cancelled: statusCounts.find(s => s.status === "cancelled")?.count || 0
        };
    }

    async analytics(from: string, to: string): Promise<requestAnalyticsDto> {

        const fromDate = new Date(from)
        const toDate = new Date(to)
        const [trends, districtPerformance, topCities] = await Promise.all([
            this.pickupRequestRepository.findrequestTrends(fromDate, toDate),
            this.pickupRequestRepository.findDistrictPerformace(fromDate, toDate, 6),
            this.pickupRequestRepository.findTopCitys(fromDate, toDate, 5)
        ])

        return {
            trends,
            districtPerformance,
            topCities
        }
    }


}