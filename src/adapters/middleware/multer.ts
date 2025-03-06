import multer, {FileFilterCallback} from 'multer'
import { Request } from 'express'

const storage = multer.memoryStorage()

// const storage = multer.diskStorage({
//     destination: (req, file, cb) =>{
//         cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix)
//       }
// })

const fileFilter = (req:Request , file: any, cb: any) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        console.log('error in multer')
        cb(new Error('Only image files are allowed!'), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
})

export default upload