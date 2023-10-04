const express = require('express');
// import express from "express"

import { activateUser, loginUser, registrationUser } from "../controllers/user.controller";

const userRouter = express.Router();

// Registro de usuario
userRouter.post("/registration", registrationUser);

// Activacion de usuario
userRouter.post("/activation", activateUser);

// Login de usuario
userRouter.get("/login", loginUser);



 
export default userRouter;