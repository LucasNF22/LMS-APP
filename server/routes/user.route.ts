const express = require('express');
// import express from "express"

import { activateUser, registrationUser } from "../controllers/user.controller";

const userRouter = express.Router();

// Registro de usuario
userRouter.post("/registration", registrationUser);

// Activacion de usuario
userRouter.post("/activation", activateUser);


 
export default userRouter;