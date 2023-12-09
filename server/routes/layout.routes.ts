const express = require('express');
import { createLayout, editLayout, getLayoutByType } from '../controllers/layout.controller';
import { authorizedRoles, isAuthenticated } from '../middlewares/auth';
const layoutRouter = express.Router();

// Crear layout -- Solo Admin
layoutRouter.get( "/create-layout", [isAuthenticated, authorizedRoles("admin")], createLayout );

// Editar layout -- Solo Admin
layoutRouter.put( "/edit-layout", [isAuthenticated, authorizedRoles("admin")], editLayout );

// Obtener Layout
layoutRouter.get( "/get-layout", getLayoutByType );

export default layoutRouter;