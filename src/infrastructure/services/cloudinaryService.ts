import { injectable } from "inversify";
import cloudinary from "../config/cloudinaryConfig";
import crypto from "crypto";
import axios from "axios";
import { ICloudinaryService } from "../../interfaces/services/ICloudinaryService";

@injectable()
export class cloudinaryService implements ICloudinaryService {
    uploadImage(imageBuffer: Buffer, folder: string): Promise<string> {
        return new Promise((res, rej) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: folder },
                (error, result) => {
                    if (error) {
                        rej(error)
                    } else {
                        console.log('result ', result)
                        res(result?.secure_url as string)
                    }
                }
            )
            uploadStream.end(imageBuffer)
        })
    }
    

    async deleteImage(publicId: string) {
        try {
            const timestamp = Math.floor(new Date().getTime() / 1000);
            const apiSecret = process.env.CLOUDINARY_API_SECRET;
            const apiKey = process.env.CLOUDINARY_API_KEY;
            const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

            const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
            const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
                {
                    public_id: publicId,
                    timestamp,
                    signature,
                    api_key: apiKey,
                }
            );

            return response.data
        } catch (error) {
            console.log('error deletign image ', error)
        }
    }

}