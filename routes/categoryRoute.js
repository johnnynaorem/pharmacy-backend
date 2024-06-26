import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { categoryController, deleteCategory, getAllCategory, getSingleCategory, updateCategoryController } from '../controller/categoryController.js';

const router = express.Router();

//routes
//createCategory Route
router.post('/create-category', requireSignIn, isAdmin, categoryController)

//updateCategory Route
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)

//getAllCategory
router.get('/get-category', getAllCategory)

//getAllCategory
router.get('/single-category/:slug', getSingleCategory)

//deleteCategory
router.delete('/delete-category/:id',requireSignIn, isAdmin, deleteCategory)
export default router;