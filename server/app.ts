require('dotenv').config();
import { NextFunction, Request, Response } from 'express';
import express from 'express';
export const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from './middlewares/error';
import userRouter from './routes/user.route';


// Body parser
app.use(express.json({limit: "50mb"}));


// cookie parser
app.use(cookieParser());


// cors => cross origin resource sharing
app.use(cors({
    origin: process.env.ORIGIN
}));

// rutas
app.use('/api/v1', userRouter)


// Testing API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        succes: true,
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
