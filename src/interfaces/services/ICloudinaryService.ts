export interface ICloudinaryService {
    uploadImage(image: Buffer, folder?: string): Promise<string>
}