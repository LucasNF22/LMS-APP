const express = require('express');
import { getNotifications } from '../controllers/notification.controller';
import { authorizedRoles, isAuthenticated } from '../middlewares/auth';
const notificationRouter = express.Router();

// Obtener notificaciones
notificationRouter.get( "/get-notifications", [isAuthenticated, authorizedRoles("admin")], getNotifications );


export default notificationRouter;