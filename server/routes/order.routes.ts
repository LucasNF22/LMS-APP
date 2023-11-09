import express = require('express');
import { authorizedRoles, isAuthenticated } from '../middlewares/auth';
import { createOrder, getAllOrders } from '../controllers/order.controller';

const orderRouter = express.Router();

// Crear orden
orderRouter.post( "/create-order", isAuthenticated , createOrder );

// Obtener todas las ordenes
orderRouter.get( "/get-orders", [ isAuthenticated, authorizedRoles("admin") ], getAllOrders );




export default orderRouter;