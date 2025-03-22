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
import { googleAuthService } from "../infrastructure/services/googleAuthService";
import { IGoogleAuthService } from "../interfaces/services/IGoogleAuthService";
import { decode } from "punycode";
import { IFacebookAuthService } from "../interfaces/services/IFacebookAuthService";
import { ICollectorRepository } from "../interfaces/repositories/ICollectorRepository";


@injectable()
export class authInteractor implements IAuthInteractor {
    constructor(
        @inject(INTERFACE_TYPE.userRepository) private userRepository: IUserRepository,
        @inject(INTERFACE_TYPE.collectorRepoitory) private collectorRepoitory: ICollectorRepository,
        @inject(INTERFACE_TYPE.otpService) private otpService: IOtpService,
        @inject(INTERFACE_TYPE.redisRepository) private redisRepository: IRedisRepository,
        @inject(INTERFACE_TYPE.cloudinaryService) private cloudinaryService: ICloudinaryService,
        @inject(INTERFACE_TYPE.jwtService) private jwtService: IJwtService,
        @inject(INTERFACE_TYPE.hashingService) private hashingService: IHashingService,
        @inject(INTERFACE_TYPE.googleAuthService) private googleAuthService: IGoogleAuthService,
        @inject(INTERFACE_TYPE.facebookAuthService) private facebookAuthService: IFacebookAuthService
    ) { }

    //registeration step one 
    async basicInfo(userData: basicInfoDto) {

        const isEmailExist = await this.userRepository.findUserByEmail(userData.email)
        
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

    async basicInfoGoogle(code: string) {

        //get tokens from google
        const tokens = await this.googleAuthService.getTokens(code)

        //decode and validate id token
        const decoded = await this.jwtService.decodeToken(tokens.id_token)
        if(!decoded){
            throw new InvalidCredentialsError('invalid')
        }

        // destructor recured values
        const {sub, given_name, family_name, email } = decoded

        //check handle user already exist
        const user = await this.userRepository.findUserByEmail(email)
        if(user){
            throw new conflictError('already exist')
        }

        //generate otp
        const otp = generateOTP()
        console.log('otp ', otp)

        //sent otp 
        await this.otpService.sentOtp(email, otp)

        //temperatly sotre otp to redis
        await this.redisRepository.set(`otp:${email}`, otp, 300)

        //temperarly store user data's in redis
        await this.redisRepository.set(`user:${email}`, {
            googleId: sub,
            firstName: given_name,
            lastName: family_name,
            email: email
        })    

        //return email to controller
        return email
    }

    async basicInfoFB(userId: string, token: string): Promise<string> {
        
        //get user details
        const result = await this.facebookAuthService.getUserByFacebookIdAndAccessToken(userId, token)
        const {id, first_name, last_name, email} = result.data
        console.log('result ', result)

        const user = await this.userRepository.findUserByEmail(email)
        console.log('user ', user)
        if(user){
            throw new conflictError('already exist')
        }

        //generate otp
        const otp = generateOTP()
        console.log('otp ', otp)

        //sent otp 
        await this.otpService.sentOtp(email, otp)

        //temperatly sotre otp to redis
        await this.redisRepository.set(`otp:${email}`, otp, 300)

        //temperarly store user data's in redis
        await this.redisRepository.set(`user:${email}`, {
            facebookId: id,
            firstName: first_name,
            lastName: last_name,
            email: email
        })

        return email

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

        const user = await this.userRepository.create(userToSave)

        if (role === 'collector') {
            const collectorToSave = {
                userId: user._id,
                idCard,
                vehicleDetails: {
                    ...parsedVehicleInfo,
                    image: vehicleImage
                }
            }
            await this.collectorRepoitory.create(collectorToSave)
        }

        //delete user data from redis
        await this.redisRepository.delete(`user:${email}`)

        const accessToken = this.jwtService.generateAccessToken({ _id: user._id, role: role })
        const refreshToken = this.jwtService.generateRefreshToken({ _id: user._id, role: role })

        return { accessToken, refreshToken, role }

    }

    //login
    async login(data: loginDto): Promise<authResponseDto> {
        const { email, password } = data

        //check for user
        const user = await this.userRepository.findUserByEmail(email)

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
        return { accessToken, refreshToken, role: user.role }
    }

    //google login
    async googleLogin(code: string): Promise<authResponseDto> {

        //get token from google
        const tokens = await this.googleAuthService.getTokens(code)

        //decode and validate ID token
        const decoded = await this.jwtService.decodeToken(tokens.id_token)
        if (!decoded) {
            throw new InvalidCredentialsError('invalid')
        }


        //find user by google id
        const { sub } = decoded
        const user = await this.userRepository.findUserByGoogleId(sub)
        if (!user) {
            throw new notFound('user not found')
        }

        //check the user is blocked
        if(user.isBlock){
            throw new Forbidden('you are blocked by admin')
        }

        //generate access and refresh token 
        const accessToken = this.jwtService.generateAccessToken({ _id: user._id, role: user.role })
        const refreshToken = this.jwtService.generateRefreshToken({ _id: user._id, role: user.role })

        //return the response
        return { accessToken, refreshToken, role: user.role }
    }

    async facebookLogin(userId: string, token: string): Promise<authResponseDto> {

        //get user details
        const result = await this.facebookAuthService.getUserByFacebookIdAndAccessToken(userId, token)
        console.log('result ', result.data)
        
        //find user by facbook id
        const user = await this.userRepository.findUserByFacebookId(result.data.id)

        //check user exist in database
        if(!user){
            throw new notFound('user not found')
        }

        //check user is blocked
        if(user.isBlock){
            throw new notFound('you are blocked by admin')
        }

        //generate access and refresh token 
        const accessToken = this.jwtService.generateAccessToken({ _id: user._id, role: user.role })
        const refreshToken = this.jwtService.generateRefreshToken({ _id: user._id, role: user.role })

        return { accessToken, refreshToken, role: user.role}
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.userRepository.findUserByEmail(email)

        if(!user){
            throw new notFound('user not found')
        }

        //generate otp 
        const otp = generateOTP()
        console.log('otp ', otp)

        //send otp 
        await this.otpService.sentOtp(email, otp)

        //temporarily store otp to the redis
        await this.redisRepository.set(`otp:${email}`, otp, 300)
    }

    async resetPassword(email: string, newPassword: string): Promise<void> {

        const user = await this.userRepository.findUserByEmail(email)

        if(!user){
            throw new notFound('user not found')
        }

        const password = await this.hashingService.hash(newPassword)

        const newUser = await this.userRepository.chagePassword(user._id as string, password)
        console.log('new user ', newUser)

    }


    async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
        const decode = await this.jwtService.verifyRefreshToken(refreshToken);
        const accessToken = await this.jwtService.generateAccessToken({
            _id: decode._id,
            role: decode.role,
        });

        if (decode.role !== 'admin') {
            const user = await this.userRepository.findUserById(decode._id)

            if (!user) {
                throw new notFound('user not found')
            }

            if (user.isBlock) {
                throw new Forbidden('you are blocked by admin')
            }
        }
        return {
            accessToken,
            role: decode.role,
        };
    }


}