const express = require('express');
import { editCourse, getAllCourses, getCourseByUser, getSingleCourse, uploadCourse } from '../controllers/course.controller';
import { authorizedRoles, isAuthenticated } from '../middlewares/auth';
const courseRouter = express.Router();

// Crear curso
courseRouter.post( "/create-course", [isAuthenticated, authorizedRoles("admin")], uploadCourse );

// Editar curso
courseRouter.put( "/edit-course/:id", [isAuthenticated, authorizedRoles("admin")], editCourse );

// obetener un curso no comprado
courseRouter.get( "/get-course/:id", getSingleCourse );

// obetener todos los cursos no comprados
courseRouter.get( "/get-courses", getAllCourses );

// Obtener contenido de curso comprado
courseRouter.get( "/get-course-content/:id", isAuthenticated, getCourseByUser );

export default courseRouter;