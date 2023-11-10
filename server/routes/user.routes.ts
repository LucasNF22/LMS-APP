const express = require('express');
// import express from "express"

import { activateUser, deleteUser, getAllUsers, getUserInfo, loginUser, logoutUser, registrationUser, socialAuth, updateAccessToken, updateProfilePicture, updateUserInfo, updateUserPassword, updateUserRole } from "../controllers/user.controller";
import { authorizedRoles, isAuthenticated } from "../middlewares/auth";

const userRouter = express.Router();

// Registro de usuario
userRouter.post("/registration", registrationUser);

// Activacion de usuario
userRouter.post("/activation", activateUser);

// Login de usuario
userRouter.get("/login", loginUser);

// Logout de usuario
userRouter.get("/logout", [ isAuthenticated, authorizedRoles('user') ], logoutUser);

// Update AccessToken
userRouter.get("/refresh", updateAccessToken);

// User Info
userRouter.get("/me", isAuthenticated, getUserInfo);

// Social Auth
userRouter.post("/social-auth", socialAuth);

// Update info de usuario
userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);

// Update password de usuario
userRouter.put("/update-user-password", isAuthenticated, updateUserPassword);

// Update avatar de usuario
userRouter.put("/update-user-avatar", isAuthenticated, updateProfilePicture);

// Obtener todos los usuarios -- Solo Admin
userRouter.get("/get-users", [ isAuthenticated, authorizedRoles('admin') ], getAllUsers);

// Actualizar rol de usuario -- Solo Admin
userRouter.put("/update-user", [ isAuthenticated, authorizedRoles('admin') ], updateUserRole);

// Eliminar usuarios -- Solo Admin
userRouter.delete("/delete-user/:id", [ isAuthenticated, authorizedRoles('admin') ], deleteUser);


 
export default userRouter;