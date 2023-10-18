const express = require('express');
import { uploadCourse } from '../controllers/course.controller';
import { authorizedRoles, isAuthenticated } from '../middlewares/auth';
const courseRouter = express.Router();

// Crear curso
courseRouter.post( "/create-course", [isAuthenticated, authorizedRoles("admin")], uploadCourse );

export default courseRouter;