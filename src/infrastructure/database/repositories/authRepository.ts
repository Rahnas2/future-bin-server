import { ICollector } from "../../../domain/entities/collector";
import { IUser } from "../../../domain/entities/user";
import collectorModel from "../models/collector";
import userModel from "../models/user";


export class authRepository {

    async findByEmail(email: string){
        return await userModel.findOne({email}) 
    }

    async saveUser(userData: any){
        console.log('user data ', userData)
        const user = await userModel.create(userData)
        console.log('created user', user)
        return user._id
        
    }

    async saveCollector(collectorData: any){
        await collectorModel.create(collectorData)
    }
}