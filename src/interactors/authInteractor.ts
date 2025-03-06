import { inject, injectable } from "inversify";
import { IAuthRepository } from "../interfaces/repositories/IAuthRepository";
import { INTERFACE_TYPE } from "../utils/appConst";
import { IOtpService } from "../interfaces/services/IOtpService";
import generateOTP from "../utils/generateOTP";
import { basicInfoDto } from "../dtos/basicInfoDto";
import { IRedisRepository } from "../interfaces/repositories/IRedisRepository";
import { completeProfileDto } from "../dtos/completeProfileDtos";
import { IUser } from "../domain/entities/user";
import { ICollector } from "../domain/entities/collector";
import { ICloudinaryService } from "../interfaces/services/ICloudinaryService";
import { IAuthInteractor } from "../interfaces/interactors/IAuthInteractor";
import { IJwtService } from "../interfaces/services/IJwtService";
import { IHashingService } from "../interfaces/services/IHashingService";
import { loginDto } from "../dtos/loginDtos";
import { BlockedUserError, conflictError, Forbidden, InvalidCredentialsError, notFound } from "../domain/errors";
import { getGoogleOAuthConfig } from "../utils/oauthUtils";
import axios from "axios";
import { authResponseDto } from "../dtos/authResponseDto";
import { TokenResponseDto } from "../dtos/tokenResponseDto";

import { IUserRepository } from "../interfaces/repositories/IUserRepository";


@injectable()
export class authInteractor implements IAuthInteractor {
    private repository: IAuthRepository
    private userRepository: IUserRepository
    private otpService: IOtpService
    private redisRepository: IRedisRepository
    private cloudinaryService: ICloudinaryService
    private jwtService: IJwtService
    private hashingService: IHashingService

    constructor(
        @inject(INTERFACE_TYPE.authRepository) repository: IAuthRepository,
        @inject(INTERFACE_TYPE.userRepository) userRepository: IUserRepository,
        @inject(INTERFACE_TYPE.otpService) otpService: IOtpService,
        @inject(INTERFACE_TYPE.redisRepository) redisRepository: IRedisRepository,
        @inject(INTERFACE_TYPE.cloudinaryService) cloudinaryService: ICloudinaryService,
        @inject(INTERFACE_TYPE.jwtService) jwtService: IJwtService,
        @inject(INTERFACE_TYPE.hashingService) hashingService: IHashingService
    ) {
        this.repository = repository
        this.userRepository = userRepository
        this.otpService = otpService
        this.redisRepository = redisRepository
        this.cloudinaryService = cloudinaryService
        this.jwtService = jwtService
        this.hashingService = hashingService
    }

    //registeration step one 
    async basicInfo(userData: basicInfoDto) {

        const isEmailExist = await this.repository.findByEmail(userData.email)
        if (isEmailExist) {
            throw new conflictError('Email is already taken')
        }

        //generate otp 
        const otp = generateOTP()
        console.log('otp ', otp)

        //send otp 
        await this.otpService.sentOtp(userData.email, otp)

        //temporarily store otp to the redis
        await this.redisRepository.set(`otp:${userData.email}`, otp, 300)

        //hash password
        const hashedPassword = await this.hashingService.hash(userData.password)

        //temporarily store basic user information's to the redis
        await this.redisRepository.set(`user:${userData.email}`, {
            ...userData,
            password: hashedPassword
        })
    }

    //registeration step two
    async verifyOtp(email: string, otp: string) {
        const Otp = await this.redisRepository.get(`otp:${email}`)
        return Otp === otp
    }

    async resentOtp(email: string): Promise<void> {

        const previousOtp = await this.redisRepository.get(`otp:${email}`)

        if (previousOtp) {
            await this.redisRepository.delete(`otp:${email}`)
        }

        //generate otp 
        const otp = generateOTP()
        console.log('resentd otp  ', otp)

        //send otp 
        await this.otpService.sentOtp(email, otp)

        //temporarily store otp to the redis
        await this.redisRepository.set(`otp:${email}`, otp, 300)
    }

    //registeration step three
    async updateRole(email: string, role: string) {
        await this.redisRepository.update(`user:${email}`, { role: role })
    }

    //registeratin last step
    async completeProfile(data: any, files: Record<string, Express.Multer.File[]>) {
        const { email, mobile, address, vehicleDetails } = data

        const parsedAddress = JSON.parse(address)
        const parsedVehicleInfo = vehicleDetails ? JSON.parse(vehicleDetails) : null

        //stored data from redis
        const userData: basicInfoDto | null = await this.redisRepository.get(`user:${email}`)
        if (!userData) {
            throw new notFound("User data not found in Redis")
        }

        let image: null | string = null
        let idCard = { front: '', back: '' };
        let vehicleImage: null | string = null

        //store files to cloudinary
        if (files) {
            if (files.image) {
                image = await this.cloudinaryService.uploadImage(files.image[0].buffer, 'profile-images')
            }
            if (files.idCardFront) {
                idCard.front = await this.cloudinaryService.uploadImage(files.idCardFront[0].buffer, 'id-cards')
            }
            if (files.idCardBack) {
                idCard.back = await this.cloudinaryService.uploadImage(files.idCardBack[0].buffer, 'id-cards')
            }
            if (files.vehicleImage) {
                vehicleImage = await this.cloudinaryService.uploadImage(files.vehicleImage[0].buffer, 'vehicle-images')
            }
        }

        //user role
        const role = userData.role

        //save common fields in the user collection
        const userToSave = {
            ...userData,
            mobile,
            address: parsedAddress,
            image
        }

        const userId = await this.repository.saveUser(userToSave)

        if (role === 'collector') {
            const collectorToSave = {
                userId: userId,
                idCard,
                vehicleDetails: {
                    ...parsedVehicleInfo,
                    image: vehicleImage
                }
            }
            await this.repository.saveCollector(collectorToSave)
        }

        //delete user data from redis
        await this.redisRepository.delete(`user:${email}`)

        const accessToken = this.jwtService.generateAccessToken({ _id: userId, role: role })
        const refreshToken = this.jwtService.generateRefreshToken({ _id: userId, role: role })

        // await this.redisRepository.set(`refreshToken:${userId}`, refreshToken)

        return { accessToken, refreshToken, role }

    }

    //login
    async login(data: loginDto): Promise<authResponseDto> {
        const { email, password } = data

        //check for user
        const user = await this.repository.findByEmail(email)

        //user not found
        if (!user) {
            throw new InvalidCredentialsError('invalid email')
        }

        //check user is blocked ?
        if (user.isBlock) {
            throw new BlockedUserError('you are blocked by admin')
        }

        //compare password
        const result = await this.hashingService.compare(password, user.password as string)

        //check password is wrong
        if (!result) {
            throw new InvalidCredentialsError('invalid password')
        }

        //generate access & refresh token

        const accessToken = this.jwtService.generateAccessToken({ _id: user._id, role: user.role })
        const refreshToken = this.jwtService.generateRefreshToken({ _id: user._id, role: user.role })


        //return access token 
        return { accessToken, refreshToken, role:user.role }
    }

    //google login
    async googleLogin(code: string): Promise<string> {
        const oauthConfig = getGoogleOAuthConfig(code)
        console.log('auth config', oauthConfig)

        try {
            const response = await axios.post('https://oauth2.googleapis.com/token', {
                code: code,
                client_id: '3144012594-6hqsjqjc8gf3880dkp3n7vqsicml2as1.apps.googleusercontent.com',
                client_secret: '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',
                redirect_uri: 'http://localhost:5173/login',
                grant_type: 'authorization_code'
            },
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
        } catch (error) {
            console.error('interactor axios ', error)
        }


        // console.log('reponse ', response)
        // const { id_token } = response.data
        // console.log('id token ', id_token)

        // const decodedToken = JSON.parse(Buffer.from(id_token.split('.')[1], 'base64').toString());
        // const { email, name } = decodedToken

        // const user = await this.repository.findByEmail(email)

        // if(!user){
        //     throw new notFound('email not found')
        // }

        // //generate access & refresh token
        // const accessToken = this.jwtService.generateAccessToken({ userId: user._id })
        // const refreshToken = this.jwtService.generateRefreshToken({ userId: user._id })

        // return accessToken
        return ''

    }

    async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
        const decode = await this.jwtService.verifyRefreshToken(refreshToken);
        const accessToken = await this.jwtService.generateAccessToken({
            _id: decode._id,
            role: decode.role,
        });

        if(decode.role !== 'admin') {
            const user = await this.userRepository.findUserById(decode._id)

            if(!user){
                throw new notFound('user not found')
            }

            if(user.isBlock) {
                throw new Forbidden('you are blocked by admin')
            }
        }
        return {
            accessToken,
            role: decode.role,
        };
    }


}