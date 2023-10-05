require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";
interface ItokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: "lax" | "strict" | "none" | undefined;
    secure?: boolean;
}

export const sendToken = (user: IUser, statuscode: number, res: Response) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    // Subir la session a redis
    redis.set(user._id, JSON.stringify(user) as any);

    // Parsear variables de entorno para integrarlas con los valores de reserva.
    const accessTokenExpire = parseInt(
        process.env.ACCESS_TOKEN_EXPIRE || "300",
        10
    );
    const refreshTokenExpire = parseInt(
        process.env.REFRESH_TOKEN_EXPIRE || "1200",
        10
    );

    const accessTokenOptions: ItokenOptions = {
        expires: new Date(Date.now() + accessTokenExpire + 1000),
        maxAge: accessTokenExpire + 10,
        httpOnly: true,
        sameSite: "lax",
    };

    const refreshTokenOptions: ItokenOptions = {
        expires: new Date(Date.now() + refreshTokenExpire + 1000),
        maxAge: refreshTokenExpire + 10,
        httpOnly: true,
        sameSite: "lax",
    };

    // Setear modo seguro solo en produccion
    if (process.env.NODE_ENV === "production") {
        accessTokenOptions.secure = true;
    }

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(statuscode).json({
        success: true,
        user,
        accessToken,
    });
};
