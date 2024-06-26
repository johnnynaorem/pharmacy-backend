import express from "express";
import {getAllOrdersController, getAllUsers, getDeleteUser, getPhoto, getPrescriptionController, getPrescriptionPhoto, getSingleUser, loginController, orderById, orderByOrderId, orderController, orderStatusController, registerController, testController, updatePrescriptionStatusController, uploadPrescriptionController} from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from 'express-formidable'

//router object
const router = express.Router()

//routing
//REGISTER || METHOD POST
router.post('/register',formidable(), registerController)

//LOGIN || METHOD POST
router.post('/login', loginController)

//get user image route
router.get('/user-image/:pid', getPhoto);

//getAll User 
router.get('/getAll', requireSignIn, isAdmin, getAllUsers)

//get single user 
router.get('/getuser/:userId', requireSignIn, getSingleUser)

//delete single user 
router.delete('/delete-user/:userId', requireSignIn, isAdmin, getDeleteUser)

//test route
router.get('/test', requireSignIn, isAdmin, testController)

//protected Route Auth
router.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ok: true})
})
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ok: true})
})

//orders
router.get('/orders', requireSignIn, orderController)

//ordersByUserId
router.get('/orders/:userId', requireSignIn, orderById)

//ordersbyOrderId
router.get('/order/:orderId', requireSignIn, orderByOrderId)

//all orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController)

//order status update
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController)

//upload prescription
router.post('/uploadPrescription/:userId',requireSignIn, formidable(), uploadPrescriptionController)

// prescription status update
router.put('/updatePrescriptionStatus/:pid',requireSignIn, isAdmin, updatePrescriptionStatusController)

// prescription get
router.get('/getPrescription/:userId',requireSignIn, getPrescriptionController)

//prescription image
router.get('/getPrescriptionImage/:pid',getPrescriptionPhoto)


export default router;