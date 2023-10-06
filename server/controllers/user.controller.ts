require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import Jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { sendToken } from "../utils/jwt";

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

            const isEmailExist = await userModel.findOne({ email });
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

    const token = Jwt.sign(
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

            const newUser: { user: IUser; activationCode: string } = Jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET as string
            ) as { user: IUser; activationCode: string };

            if (newUser.activationCode !== activation_code) {
                return new ErrorHandler("Código de activación inválido", 400);
            }

            const { name, email, password } = newUser.user;

            const existUser = await userModel.findOne({ email });

            if (existUser) {
                return next(new ErrorHandler("El email ya esta en uso.", 400));
            }

            const user = await userModel.create({
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

            const user = await userModel.findOne({ email }).select("password");

            if (!user) {
                return next( new ErrorHandler( "Email o constraseña incorrectos", 400 ));
            }

            const isPasswordMatch = await user?.comparePassword(password);

            if (!isPasswordMatch) {
                return next(new ErrorHandler("Invalid email or password", 400));
            };
            
            sendToken(user, 200, res);


        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);
