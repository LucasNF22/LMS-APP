require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
var bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp =
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    courses: Array<{ courseId: string }>;
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Por favor ingrese su nombre"],
        },

        email: {
            type: String,
            required: [true, "Por favor ingrese su email"],
            validate: {
                validator: function (value: string) {
                    return emailRegexPattern.test(value);
                },
                message: "Ingrese un email válido",
            },
            unique: true,
        },

        password: {
            type: String,
            required: [true, "Por favor ingrese su contraseña"],
            minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
            selec: false,
        },

        avatar: {
            public_id: String,
            url: String,
        },

        role: {
            type: String,
            default: "user",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        courses: [
            {
                courseId: String,
            },
        ],
    },
    { timestamps: true }
);

// Hashear contraseña antes de guardarla
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Sign Access_token
userSchema.methods.SignAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
        expiresIn: "5m"
    });
};

// sign refresh_token
userSchema.methods.SignRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
        expiresIn: "3d"
    });
};

// Comparar constraseñas
userSchema.methods.comparePassword = async function (
    enteredPassword: string
): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("user", userSchema);

export default userModel;
