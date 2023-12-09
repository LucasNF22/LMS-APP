import { getCoursesAnalytics, getOrdersAnalytics, getUserAnalytics } from "../controllers/analytics.controller";
import { authorizedRoles, isAuthenticated } from "../middlewares/auth";

const express = require('express');

const analyticsRouter = express.Router();

// Obtener analiticas de Usuarios
analyticsRouter.get("/get-users-analytics", [ isAuthenticated, authorizedRoles("admin") ], getUserAnalytics);

// Obtener analiticas de Cursos
analyticsRouter.get("/get-courses-analytics", [ isAuthenticated, authorizedRoles("admin") ], getCoursesAnalytics);

// Obtener analiticas de Cursos
analyticsRouter.get("/get-orders-analytics", [ isAuthenticated, authorizedRoles("admin") ], getOrdersAnalytics);


export default analyticsRouter;