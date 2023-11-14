const express = require('express');
import { createLayout } from '../controllers/layout.controller';
import { authorizedRoles, isAuthenticated } from '../middlewares/auth';
const layoutRouter = express.Router();

// Crear layout -- Solo Admin
layoutRouter.get( "/create-layout", [isAuthenticated, authorizedRoles("admin")], createLayout );

export default layoutRouter;