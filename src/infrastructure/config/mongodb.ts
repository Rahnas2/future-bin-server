import mongoose from "mongoose";


const connectDB = async (): Promise<void> => {
    try {
        const mongURI = process.env.MONGO_URL as string
        console.log('mongourl ',mongURI)
        await mongoose.connect(mongURI)
        console.log('mongodb connected successfully')
    } catch (error) {
        console.error('mongodb connection error ', error)
    }
}

export default connectDB