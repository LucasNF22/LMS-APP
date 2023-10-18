const express = require('express');
import { editCourse, uploadCourse } from '../controllers/course.controller';
import { authorizedRoles, isAuthenticated } from '../middlewares/auth';
const courseRouter = express.Router();

// Crear curso
courseRouter.post( "/create-course", [isAuthenticated, authorizedRoles("admin")], uploadCourse );

// Editar curso
courseRouter.put( "/edit-course/:id", [isAuthenticated, authorizedRoles("admin")], editCourse );

export default courseRouter;