import { authResponseDto } from "../../dtos/authResponseDto";

export interface IAdminteractor{
    login(email: string, password: string, secret: string): Promise<authResponseDto>
}