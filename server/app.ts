require('dotenv').config();
import express, { NextFunction, Request, Response, Express } from 'express';
export const app: Express = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from './middlewares/error';
import userRouter from './routes/user.routes';
import courseRouter from './routes/course.routes';
import orderRouter from './routes/order.routes';
import notificationRouter from './routes/notification.routes';
import analyticsRouter from './routes/analytics.routes';
import layoutRouter from './routes/layout.routes';

// Body parser
app.use(express.json({limit: "50mb"}));


// cookie parser
app.use(cookieParser());


// cors => cross origin resource sharing
app.use(cors({
    origin: process.env.ORIGIN
}));

// rutas
app.use("/api/v1", userRouter, orderRouter, courseRouter, notificationRouter, analyticsRouter, layoutRouter);




// Testing API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "Testing API en funcionamiento."
    })
});


// Ruta desconocida
app.get("/*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not Found`) as any;
    err.statusCode = 404;
    next(err);
});


app.use(ErrorMiddleware);
