import { inject, injectable } from "inversify";
import { InvalidCredentialsError } from "../domain/errors";
import { INTERFACE_TYPE } from "../utils/appConst";
import { IAdminRepository } from "../interfaces/repositories/IAdminRepository";
import { IHashingService } from "../interfaces/services/IHashingService";
import { IJwtService } from "../interfaces/services/IJwtService";
import { IAdminteractor } from "../interfaces/interactors/IAdminInteractor";

// @injectable()
export class adminInteractor implements IAdminteractor {

    constructor(@inject(INTERFACE_TYPE.adminRepository) private adminRepository: IAdminRepository,
        @inject(INTERFACE_TYPE.hashingService) private hashingService: IHashingService,
        @inject(INTERFACE_TYPE.jwtService) private jwtService: IJwtService,
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

        return {accessToken, refreshToken, role: 'admin'}

    }

    
}