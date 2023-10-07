const express = require('express');
// import express from "express"

import { activateUser, loginUser, logoutUser, registrationUser } from "../controllers/user.controller";
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



 
export default userRouter;