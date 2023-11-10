import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler';



export const ErrorMiddleware = ( 
    err:any, 
    req:Request, 
    res:Response, 
    next:NextFunction  
    
) => {

    err.statusCode = err.statusCode || 500;
    err.statusCode = err.statusCode || "Internal server error";

    // Error de MongoDB id
    if( err.name === "CastError" ){
        const message = `Resource not found. Invalid: ${ err.path }`;
        err = new ErrorHandler( message, 400 );
    };

    // Error Key duplicada
    if( err.code === 11000 ){
        const message = `Duplicate ${ Object.keys( err.KeyValue ) } entered`;
        err = new ErrorHandler( message, 400 );
    };

    // Error JWT expirado
    if( err.name == "JsonWebTokenError" ){
        const message = "Json web Token is invalid, try again";
        err = new ErrorHandler( message, 400 );
    };

    // Error JWT erróneo
    if( err.name == "TokenExpiredError" ){
        const message = "Json web Token is expired, try again";
        err = new ErrorHandler( message, 400 );
    };

    res.status(err.statusCode).json({
        success: true,
        message: err.message
    });

};