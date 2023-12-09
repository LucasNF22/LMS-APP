import NotificationModel from '../models/notificationModel';
import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../middlewares/catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import cron from 'node-cron';
import { log } from 'console';


// Obtener notificaciones
export const getNotifications = CatchAsyncError( async( req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await NotificationModel.find().sort({ createdAt: -1 });

        res.status(201).json({
            success: true,
            notifications,
        });

    } catch (error: any) {
        return next(new ErrorHandler( error.message, 500));
    }
});

// Update de notificacion -- Solo admin
export const updateNotification = CatchAsyncError( async( req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await NotificationModel.findById( req.params.id );

        if( !notification){
            return next( new ErrorHandler( "No se encontró la notificación", 404));
        } else{
            notification.status ? notification.status = 'Leído' : notification.status;
        };

        await notification.save();

        const notificacion = await NotificationModel.find().sort({ createdAt: -1 });

        res.status(201).json({
            success: true,
            notificacion,
        });

    } catch (error:any) {
        return next( new ErrorHandler( error.message, 500))
    };
});


// Borrar notificaicon --Solo Admin
cron.schedule(" 0 0 0 * * * ", async() => {
    const thirtyDaysAgo = new Date( Date.now() - 30 * 24 * 60 * 60 * 1000 );
    await NotificationModel.deleteMany({ status: "Leído", createdAt: {$lt: thirtyDaysAgo} })
    console.log("Notificaciones laidas eliminadas");
    
});