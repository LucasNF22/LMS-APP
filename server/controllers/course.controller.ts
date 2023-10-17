import { Request, Response, NextFunction } from 'express';
import { CatchAsyncError } from '../middlewares/catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import cloudinary from 'cloudinary';

// Subir Curso
export const uploadCourse = CatchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail= data.course;
        if( thumbnail ){
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };

        }
    } catch (error: any) {
        return next( new ErrorHandler( error.message, 400 ))
    }
})