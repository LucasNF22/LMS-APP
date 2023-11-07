import express = require('express');
import { isAuthenticated } from '../middlewares/auth';
import { createOrder } from '../controllers/order.controller';

const orderRouter = express.Router();

// crear orden
orderRouter.post( "/create-order", isAuthenticated , createOrder );




export default orderRouter;