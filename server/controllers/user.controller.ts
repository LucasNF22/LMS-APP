require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import UserModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { getAllUsersService, getUserById, updateUserRoleService } from "../services/user.service";
import cloudinary from 'cloudinary';

// Registro de usuario
interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export const registrationUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body;

            const isEmailExist = await UserModel.findOne({ email });
            if (isEmailExist) {
                return next(new ErrorHandler("El email ya existe", 400));
            }

            const user: IRegistrationBody = {
                name,
                email,
                password,
            };

            const activationToken = createActivationToken(user);

            const activationCode = activationToken.activationCode;

            const data = { user: { name: user.name }, activationCode };
            // console.log(activationCode);
            
            const html = await ejs.renderFile(
                path.join(__dirname, "../mails/activation-mail.ejs"),
                data
            );

            try {
                await sendMail({
                    email: user.email,
                    subject: "Activacion de cuenta",
                    template: "activation-mail.ejs",
                    data,
                });

                res.status(201).json({
                    success: true,
                    message: `Por favor revise su correo: ${user.email} para activar su cuenta.`,
                    activationToken: activationToken.token,
                });
            } catch (error: any) {
                return next(new ErrorHandler(error.message, 400));
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

interface IActivationToken {
    token: string;
    activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign(
        {
            user,
            activationCode,
        },
        process.env.ACTIVATION_SECRET as Secret,
        {
            expiresIn: "5m",
        }
    );

    return { token, activationCode };
};

// Activacion de usuario
interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

export const activateUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { activation_token, activation_code } =
                req.body as IActivationRequest;

            const newUser: { user: IUser; activationCode: string } = jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET as string
            ) as { user: IUser; activationCode: string };

            if (newUser.activationCode !== activation_code) {
                return new ErrorHandler("Código de activación inválido", 400);
            }

            const { name, email, password } = newUser.user;

            const existUser = await UserModel.findOne({ email });

            if (existUser) {
                return next(new ErrorHandler("El email ya esta en uso.", 400));
            }

            const user = await UserModel.create({
                name,
                email,
                password,
            });

            res.status(201).json({
                success: true,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

// Login
interface ILoginRequest {
    email: string;
    password: string;
}

export const loginUser = CatchAsyncError( async (req: Request, res: Response, next: NextFunction) => {
        
        try {
            const { email, password } = req.body as ILoginRequest;

            if (!email || !password) {
                return next( new ErrorHandler( "Por favor ingrese su mail y contraseña", 400 ));
            };

            const user = await UserModel.findOne({ email }).select("+password");

            if (!user) {
                return next( new ErrorHandler( "Email o constraseña incorrectos", 400 ));
            }

            const isPasswordMatch = await user?.comparePassword( password );

            if (!isPasswordMatch) {
                return next(new ErrorHandler("Invalid email or password", 400));
            };
            
            sendToken(user, 200, res);


        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);


// Logout de usuario                     
export const logoutUser = CatchAsyncError( async( req: Request, res: Response, next: NextFunction ) => {
    
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });

        const userId = req.user?._id || "";
        
        redis.del(userId);

        res.status(200).json({
            success: true, 
            messge: "Su sesión ha sido cerrada corectamente"
        });

    } catch (error: any) {
        return next( new ErrorHandler(error.message, 400) );
    };
});


// Update del access-token
export const updateAccessToken = CatchAsyncError( async( req: Request, res: Response, next: NextFunction ) => {
    try {
        const refresh_token = req.cookies.refresh_token as string;
        
        const decoded = jwt.verify(
            refresh_token, 
            process.env.REFRESH_TOKEN as string 
        ) as JwtPayload;

        const message = "No se pudo refrescar el token";
        if( !decoded ){
            return next( new ErrorHandler( message, 400 ));
        };

        const session = await redis.get( decoded.id as string );
        if( !session ){
            return next( new ErrorHandler( "Por favor ingrese a la plataforma para visualizar este contenido", 400 ));
        };

        const user = JSON.parse( session );

        const accessToken = jwt.sign(
            { id: user._id }, 
            process.env.ACCESS_TOKEN as string, 
            {
                expiresIn: "5m"        
            }
        );

        const refreshToken = jwt.sign(
            {id: user._i}, 
            process.env.REFRESH_TOKEN as string, 
            {
                expiresIn: "3d"
            }
        );

        req.user = user;

        res.cookie( "access_token", accessToken, accessTokenOptions );
        res.cookie( "refresh_token", refreshToken, refreshTokenOptions );

        await redis.set( user._id, JSON.stringify(user), "EX", 604800 ); // 7 dias

        res.status(200).json({
            status: "success",
            accessToken,
        })


    } catch (error: any) {
        return next( new ErrorHandler( error.message, 400 ));
    }
});

// Obtener info de usuario
export const getUserInfo = CatchAsyncError(
    async( req: Request, res: Response, next: NextFunction ) => {
        try {
            const userId = req.user?._id;
            getUserById(userId, res);

        } catch ( error: any ) {
            return next ( new ErrorHandler( error.message, 400 ));
        };
    }
);

interface ISocialAuthBody {
    email: String,
    name: String,
    avatar: String,
}

// Social Auth
export const socialAuth = CatchAsyncError(async( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { email, name, avatar } = req.body as ISocialAuthBody;
        const user = await UserModel.findOne({ email });

        if( !user ){
            const newUser = await UserModel.create({ email, name, avatar });
            sendToken( newUser, 201, res );
        }else {
            sendToken( user, 200, res );
        };


    } catch (error: any) {
        return next ( new ErrorHandler( error.message, 400 ));
    }
});

// Update info usuario
interface IUpdateUserInfo {
    name?: string,
    email?: string,
};

export const updateUserInfo = CatchAsyncError( async( req: Request, res: Response, next:NextFunction ) => {
    try {
        const { name, email } = req.body as IUpdateUserInfo;
        const userId = req.user?._id;
        const user = await UserModel.findById(userId);

        if ( email && user ){
            const isEmailExist = await UserModel.findOne({ email });

            if( isEmailExist ){
                return next( new ErrorHandler("El email ya existe", 400));
            };
            
            user.email = email;

        };

        if( name && user ){
            user.name = name;
        }

        await user?.save();

        await redis.set( userId, JSON.stringify(user));

        res.status(201).json({
            success: true,
            user,
        });

    } catch (error: any) {
        return next ( new ErrorHandler( error.message, 400 ));
    };
});


// Update password de usuario
interface IUpdatePasword {
    oldPassword: string,
    newPassword: string,
};

export const updateUserPassword = CatchAsyncError( async( req: Request, res: Response, next: NextFunction  ) => {
    try {
        const { oldPassword, newPassword } = req.body as IUpdatePasword;

        if( !oldPassword || !newPassword ){
            return next( new ErrorHandler( "Por favor ingrese sus contraseñas", 400 ));
        }

        const user = await UserModel.findById(req.user?._id).select("+password");;

        if( user?.password === undefined ){
            return next( new ErrorHandler( "Usuario inválido", 400 ));
        };

        const isPasswordMatch = await user?.comparePassword(oldPassword);

        if( !isPasswordMatch ){
            return next( new ErrorHandler( "Password no válido", 400 ));
        };

        user.password = newPassword;

        await user.save();

        await redis.set(req.user?._id, JSON.stringify(user));

        res.status(201).json({
            succes: true,
            user,
        })

    } catch (error: any) {
        return next( new ErrorHandler(error.message, 400));
    };
});


// Update Imagen de perfil  

interface IUpdateProfilePicture{
    avatar: string,
}


export const updateProfilePicture = CatchAsyncError( async( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { avatar } = req.body as IUpdateProfilePicture;
        const userId = req.user?._id;

        const user = await UserModel.findById( userId );

        if( avatar && user ) {

            // Si el usaurio ya tiene avatar
            if( user?.avatar?.public_id ){
                // Se borra la imagen original
                await cloudinary.v2.uploader.destroy( user?.avatar?.public_id );

                // Se guarda la nueva
                const myCloud = await cloudinary.v2.uploader.upload( avatar, {
                    folder: "avatars",
                    width: 150,
                });
    
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                }

            // Si no tiene avatar
            }else {
                const myCloud = await cloudinary.v2.uploader.upload( avatar, {
                    folder: "avatars",
                    width: 150,
                });
    
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                }
            };  
        }

        await user?.save();
        await redis.set( userId, JSON.stringify( user ));

        res.status(200).json({
            succes: true,
            user,
        });
            
    } catch (error: any) {
        return next( new ErrorHandler(error.message, 400));
    }
});

// Obtener todos los usuarios -- Solo Admin
export const getAllUsers = CatchAsyncError( async( req: Request, res: Response, next: NextFunction) => {
    try {
        getAllUsersService(res);
    } catch (error: any) {
        return next( new ErrorHandler(error.message, 400));
    };
});


// Actualizar rol de usuario -- Solo Admin
export const updateUserRole = CatchAsyncError( async( req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.body;

        updateUserRoleService( res, id, role)

    } catch (error:any) {
        return next( new ErrorHandler( error.message, 400));        
    };
});


// Elmiinar usuario -- Solo Admin
export const deleteUser = CatchAsyncError( async( req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        const user = await UserModel.findById( id );
        if( !user ) {
            return next( new ErrorHandler( "Usuario no encontrado ", 404));
        };

        await user.deleteOne({ id });

        await redis.del( id );

        res.status(200).json({
            success: true,
            message: "Usuario eliminado correctamente"
        })

    } catch (error: any) {
        return next( new ErrorHandler( error.message, 400 ));
    };
});