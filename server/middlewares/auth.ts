import { Request, Response, NextFunction } from 'express';
import { CatchAsyncError } from './catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { redis } from '../utils/redis';


// Usuario autenticado
export const isAuthenticated = CatchAsyncError( async( req: Request, res: Response, next: NextFunction ) => {
    const access_token = req.cookies.access_token as string;

    if( !access_token ) {
        return next( new ErrorHandler("Por favor ingrese a la plataforma para visualizar este contenido", 400));
    };

    const decoded = jwt.verify( access_token, process.env.ACCESS_TOKEN as string ) as JwtPayload;

    if ( !decoded ){
        return next( new ErrorHandler("Access Token no válido", 400))
    };   

    const user = await redis.get(decoded.id);

    if( !user ) {
        return next( new ErrorHandler("Usuario no econtrado", 400));
    }

    req.user = JSON.parse( user );

    next();

});

// Validar rol de usuario
export const authorizedRoles = (...roles: string[]) => {
    return (req: Request, res:Response, next: NextFunction) =>{
        if(!roles.includes(req.user?.role || '' )){
            return next (new ErrorHandler(`${req.user?.role} sin permisos necesarios`, 403));
         }
        next();
    }   
}