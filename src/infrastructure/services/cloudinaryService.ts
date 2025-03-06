import { injectable } from "inversify";
import cloudinary from "../config/cloudinaryConfig";
import { error } from "console";
import { UploadStream } from "cloudinary";

@injectable()
export class cloudinaryService {
     uploadImage(imageBuffer: Buffer, folder: string){
        return new Promise((res, rej) =>{
            const uploadStream = cloudinary.uploader.upload_stream(
                {folder: folder},
                (error, result) =>{
                    if(error){
                        rej(error)
                    }else{
                        console.log('result ', result)
                        res(result?.secure_url)
                    }
                }
            )
            uploadStream.end(imageBuffer)
        })    
    }


}