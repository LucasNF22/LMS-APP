const express = require('express');
import { getNotifications, updateNotification } from '../controllers/notification.controller';
import { authorizedRoles, isAuthenticated } from '../middlewares/auth';
const notificationRouter = express.Router();

// Obtener notificaciones
notificationRouter.get( "/get-notifications", [isAuthenticated, authorizedRoles("admin")], getNotifications );

// Update notificaciones - ADMIN
notificationRouter.put( "/update-notification/:id", [isAuthenticated, authorizedRoles("admin")], updateNotification );



export default notificationRouter;