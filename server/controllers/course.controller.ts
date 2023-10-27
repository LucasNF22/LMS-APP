import { Request, Response, NextFunction } from 'express';
import { CatchAsyncError } from '../middlewares/catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import cloudinary from 'cloudinary';
import { createCourse } from '../services/course.service';
import CourseModel from '../models/course.model';
import { redis } from '../utils/redis';
import mongoose from 'mongoose';
import path from 'path';
import ejs from 'ejs';
import sendMail from '../utils/sendMail';

// Subir Curso
export const uploadCourse = CatchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;

        if( thumbnail ){
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };

        };
       createCourse(data, res, next);

    } catch (error: any) {
        return next( new ErrorHandler( error.message, 500 ))
    }
});

// Editar curso
export const editCourse = CatchAsyncError( async( req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;

        if( thumbnail ){
            await cloudinary.v2.uploader.destroy(thumbnail.public_id);

            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        };

        const courseId = req.params.id;
        const course = await CourseModel.findByIdAndUpdate(courseId, 
            { $set: data },
            { new: true },
        );

        res.status(201).json({
            success: true, 
            course
        });


    } catch (error: any) {
        return next( new ErrorHandler( error.message, 500 ))
    }
});

// Obtener un solo curso -- no comprados
export const getSingleCourse = CatchAsyncError( async(req: Request, res: Response, next: NextFunction) => {
    try {

        const courseId = req.params.id
        const isCacheExist = await redis.get(courseId);

        if( isCacheExist ){
            const course = JSON.parse( isCacheExist );
            res.status(200).json({
                success: true,
                course
            });
        }else {
        
            const course = await CourseModel.findById(courseId).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")

            await redis.set( courseId, JSON.stringify(course) );

            res.status(200).json({
                success: true, 
                course
            });
        };

    } catch (error: any) {
        return next( new ErrorHandler( error.message, 500 ))
    };
    
});

// Obtener todos los cursos -- no comprados
export const getAllCourses = CatchAsyncError( async(req: Request, res: Response, next: NextFunction) => {
    try {

        const isCacheExist = await redis.get("allCourses");
        if( isCacheExist ) {
            const courses = JSON.parse(isCacheExist);
            // console.log("redis");
            res.status(200).json({
                success: true,
                courses
            });
        }else {

            const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")

            await redis.set( "allCourses", JSON.stringify(courses) );
            // console.log("mongo");    
            res.status(200).json({
                success: true, 
                courses
            });
        };

    } catch (error: any) {
        return next( new ErrorHandler( error.message, 500 ))
    };
    
});

// Obtener contenido del curso -- solo para usuario valido.
export const getCourseByUser = CatchAsyncError( async( req: Request, res: Response, next: NextFunction ) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;

        const courseExist = userCourseList?.find(( course:any) => course._id.toString() === courseId );

        if( !courseExist ){
            return next( new ErrorHandler( "No tienes acceso al contenido de este curso", 400 ));
        };

        const course = await CourseModel.findById(courseId);
        const content = course?.courseData;

        res.status(200).json({
            success: true,
            content
        });

    } catch (error:any) {
        return next( new ErrorHandler( error.message, 500 ));
    }
});

// Crear pregunta en curso
interface IAddQuestionData {
    question: string;
    courseId: string;
    contentId: String;
};

// Hacer pregunta en curso
export const addQuestion = CatchAsyncError( async( req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, courseId, contentId } = req.body as IAddQuestionData;
        const course = await CourseModel.findById(courseId);

        if( !mongoose.Types.ObjectId.isValid(courseId)){
            return next( new ErrorHandler("Contenido inválido", 400));
        };

        const courseContent = course?.courseData?.find( (item:any) => item._id.equals(contentId) );

        if( !courseContent ){
            return ( new ErrorHandler("contenido inválido", 400))
        };

        // Crear el objeto de la pregunta 
        const newQuestion: any = {
            user: req.user,
            question,
            questionReplies: [],
        };

        // Agregar pregunta al courseContent
        courseContent.questions.push( newQuestion );

        // Guardar course actualizado
        await course?.save();

        res.status(200).json({
            success: true,
            course,
        });

    } catch (error:any) {
        return next( new ErrorHandler(error.message, 500));
    };
});


// Agregar respuesta a pregunta en curso
interface IAddAnswerData {
    answer: string,
    courseId: string,
    contentId: string,
    questionId: string,
};

export const addAnswer = CatchAsyncError( async( req: Request, res: Response, next: NextFunction) => {
    try {
        const { answer, courseId, contentId, questionId }: IAddAnswerData = req.body;

        const course = await CourseModel.findById(courseId);

        if( !mongoose.Types.ObjectId.isValid(contentId)){
            return next( new ErrorHandler("Contenido inválido", 400));
        };

        const courseContent = course?.courseData?.find( (item:any) => item._id.equals(contentId) );

        if( !courseContent ){
            return ( new ErrorHandler("contenido inválido", 400))
        };

        const question = courseContent?.questions?.find((item: any) => item._id.equals( questionId ));

        if( !question ){
            return next( new ErrorHandler( "ID de pregunta inválida", 400 ))
        };
        
        // Crear Objeto de la respuesta
        const newAnswer: any = {
            user: req.user,
            answer,
        };

        // Agregar respuesta al courseContent
        question.questionReplies?.push(newAnswer);

        await course?.save();

        if( req.user?._id === question.user._id ){
            // crear notificacion
        }else {
            const data = {
                name: question.user.name,
                title: courseContent.title
            };

            const html = await ejs.renderFile( path.join(__dirname, "../mails/questions-reply.ejs"), data )

            try {
                await sendMail({
                    email: question.user.email,
                    subject: "Respuesta a pregunta",
                    template: "question-Reply.ejs",
                    data,
                })
            } catch (error:any) {
                return next( new ErrorHandler(error.message, 500))
            }


        };

        res.status(200).json({
            success: true,
            course,
        });


    } catch (error:any) {
        return next( new ErrorHandler(error.message, 500));
    };
});

// Agregar reseña en curso
interface IAddReviewData {
    review: string,
    rating: number,
    userId: string,
};

export const addReview = CatchAsyncError( async( req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses;

        const courseId = req.params.id;

        // Checkear si el coursId existe dentro de userCoursesList segund _id
        const courseExist = userCourseList?.some(( course: any ) => course._id.toString() === courseId.toString());

        if( !courseExist ){
            return next( new ErrorHandler( "No puedes agregar una resela a este curso", 404));
        };

        const course = await CourseModel.findById( courseId );

        const { review, rating } = req.body as IAddReviewData;

        const reviewData = {
            user: req.user,
            comment: review,
            rating,
        };
               


    } catch (error: any) {
        return next( new ErrorHandler( error.message, 500))
    }
})
