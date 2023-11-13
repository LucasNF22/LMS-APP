import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middlewares/catchAsyncErrors';
import { generateLast12MonthsData } from '../utils/analytics.generator';
import UserModel from '../models/user.model';
import CourseModel from '../models/course.model';
import OrderModel from '../models/orderModel';


// Obtener analiticas de usuarios -- Solo Admin
export const getUserAnalytics = CatchAsyncError( async( req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await generateLast12MonthsData( UserModel );

        res.status(200).json({
            success: true,
            users,
        });

    } catch (error: any) {
        return next( new ErrorHandler( error.message, 500));
    }
});

// Obtener analiticas de cursos -- Solo Admin
export const getCoursesAnalytics = CatchAsyncError( async( req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await generateLast12MonthsData( CourseModel );

        res.status(200).json({
            success: true,
            courses,
        });

    } catch (error: any) {
        return next( new ErrorHandler( error.message, 500));
    }
});

// Obtener analiticas de ordenes -- Solo Admin
export const getOrdersAnalytics = CatchAsyncError( async( req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await generateLast12MonthsData( OrderModel );

        res.status(200).json({
            success: true,
            orders,
        });

    } catch (error: any) {
        return next( new ErrorHandler( error.message, 500));
    }
});
