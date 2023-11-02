import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../middlewares/catchAsyncErrors';
import OrderModel from '../models/orderModel';

// Crear nueva orden
export const newOrder = CatchAsyncError( async( res: Response, data: any, next: NextFunction ) => {
    const order = await OrderModel.create( data );
    next( order );
})
;