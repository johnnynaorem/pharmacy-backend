import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { braintreePaymentController, braintreeTokenController, createProduct, deleteProduct, getAllProduct, getPhoto, getSingleProduct, productBestSellingController, productByCategoryController, productCountController, productFilter, productListController, productRelatedController, productSearchController, updateProduct } from '../controller/productController.js';
import formidable from 'express-formidable'
import braintree from 'braintree';

const router = express.Router()

//routes
//create Product route
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProduct);

//update Product route
router.put('/update-product/:id', requireSignIn, isAdmin, formidable(), updateProduct);

//get All Product route
router.get('/get-products', getAllProduct);

//get Single Product route
router.get('/get-product/:slug', getSingleProduct);

//get Product image route
router.get('/product-image/:pid', getPhoto);

//delete Product route
router.delete('/product-delete/:id', requireSignIn, isAdmin, deleteProduct);

//filter Product route
router.post('/filter', productFilter);

//Product count
router.get('/product-count', productCountController);

//Product per page
router.get('/product-list/:page', productListController);

//Product best selling
router.get('/product-bestselling', productBestSellingController);

//Product by category
router.get('/product-category/:category', productByCategoryController);

//Product search
router.get('/product-search/:keyword', productSearchController)

// product related
router.get('/product-related/:pid/:cid', productRelatedController)

// payment token route
router.get('/braintree/token', braintreeTokenController)

// payment route
router.post('/braintree/payment',requireSignIn, braintreePaymentController)

export default router;