
import { Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { IJwtService } from "../../interfaces/services/IJwtService";
import { AuthRequest } from "../../dtos/authRequestDto";
import { Forbidden, unAuthorized } from "../../domain/errors";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";

@injectable()
export class authMiddleware {

    constructor(@inject(INTERFACE_TYPE.jwtService) private jwtService: IJwtService,
        @inject(INTERFACE_TYPE.userRepository) private userRepository: IUserRepository) { }

    validateJwt = async (req: AuthRequest, res: Response, next: NextFunction) => {
        console.log('hello guyss  ')
        try {
            const autorization = req.header("Authorization");

            if (!autorization || !autorization.startsWith("Bearer"))
                throw new unAuthorized('Unauthorized')


            const accessToken = autorization.split(" ")[1]

            if (!accessToken)
                throw new unAuthorized('Unauthorized')

            const decode = this.jwtService.verifyAccessToken(accessToken)

            if (!decode || !decode._id) {
                throw new unAuthorized("Unauthorized");
            }


            req._id = decode._id
            req.role = decode.role

            // if (decode.role !== 'admin') {

            //     const user = await this.userRepository.findUserById(decode._id)

            //     if (!user) {
            //         throw new unAuthorized('user not found')
            //     }

            //     if (user.isBlock) {
            //         throw new Forbidden('you are blocked by admin')
            //     }
            // }


            console.log('token verified ')
            next()
        } catch (error) {
            next(error)
        }

    }

    restrictTo = (...allowedRoles: string[]) =>
        async (req: AuthRequest, res: Response, next: NextFunction) => {
            try {
                if (!req._id || !req.role) {
                    throw new Forbidden("Access denied");
                }

                if (!allowedRoles.includes(req.role)) {
                    throw new Forbidden('invalid role')
                }

                if (req.role !== 'admin') {

                    const user = await this.userRepository.findUserById(req._id)

                    if (!user) {
                        throw new unAuthorized('user not found')
                    }

                    if (user.isBlock) {
                        throw new Forbidden('you are blocked by admin')
                    }
                }

                next()
            } catch (error) {
                next(error)
            }
        }

}