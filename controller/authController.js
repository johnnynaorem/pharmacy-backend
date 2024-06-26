import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import fs from 'fs'
import prescriptionModel from "../models/prescriptionModel.js";

export const registerController = async (req, res) => {
  try {
    const {name, email, password, phone, address} = req.fields;
    const {image} = req.files
    //validation
    if(!name){
      return res.send({message: "Name is Required"})
    }
    if(!email){
      return res.send({message: "email is Required"})
    }
    if(!password){
      return res.send({message: "Password is Required"})
    }
    if(!phone){
      return res.send({message: "Phone is Required"})
    }
    if(!address){
      return res.send({message: "Address is Required"})
    }
    if(!image){
      return res.send({message: "Image is required and should be less then 1MB"})
    }

    //check user
    const exisitingUser = await userModel.findOne({email});

    //exisiting user
    if(exisitingUser){
      return res.send({
        success: false,
        message: 'Already Register please login'
      })
    }
    //register user
    const hashedPassword = await hashPassword(password)
    // save
    // const user = await new userModel({name,email,phone,address,password: hashedPassword}).save();
    // res.status(201).send({
    //   success: true,
    //   message: "User Register Successfully",
    //   user
    // })

    const user = new userModel({name,email,phone,address,password: hashedPassword})
    if(image){
      user.image.data = fs.readFileSync(image.path)
      user.image.contentType = image.type
    }
    await user.save()
    res.status(201).send({
      success: true,
      message: "User Registration Successful",
      user
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error
    })
  }
}

export const loginController = async (req, res) => {
  try {
    const {email, password} = req.body;
    //validation
    if(!email || !password){
      return res.status(404).send({
        success: false,
        message: "Invalid email and password"
      })
    }
    //check user
    const user = await userModel.findOne({email});
    if(!user){
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      })
    }
    const match = await comparePassword(password, user.password)
    if(!match){
      return res.status(200).send({
        success: false,
        message: "Invalid password"
      })
    }
    //token
    const token = JWT.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
    res.status(200).send({
      success: true,
      message: 'Login successfully',
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        id: user._id
      },
      token
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in login",
      error
    })
  }
};

//getPhoto
export const getPhoto = async (req, res) => {
  try {
    const {pid} = req.params
    const user = await userModel.findById(pid).select('image')
    if(user.image.data){
      res.set('Content-type', user.image.contentType);
      res.status(200).send(user.image.data)
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error while getting image",
      error: error.message
    })
  }
}

//getAllUsers
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({
      role: {$ne: 1}
    }).select('-password').select('-image')
    res.json(users)
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in login",
      error
    })
  }
};

//getSingleUser
export const getSingleUser = async (req, res) => {
  try {
    const users = await userModel.find({_id: req.params.userId}).select('-password').select('-image')
    res.json(users)
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in login",
      error
    })
  }
};

//getDeleteUser
export const getDeleteUser = async (req, res) => {
  try {
    const users = await userModel.findByIdAndDelete({_id: req.params.userId})
    res.send({
      success: true,
      users
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in delete user",
      error
    })
  }
};

//orders 
export const orderController = async (req, res) => {
  try {
    const orders = await orderModel.find({buyer: req.user._id}).populate("products", "-image").populate({
      path: "buyer",
      select: "name address" 
    }).sort({createdAt: -1})
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in getting Order",
      error
    })
  }
}

//orderByUserId 
export const orderById = async (req, res) => {
  try {
    const {userId} = req.params
    const orders = await orderModel.find({buyer: userId}).populate("products", "-image").populate({
      path: "buyer",
      select: "name address" 
    }).sort({createdAt: -1})
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in getting Order",
      error 
    })
  }
}

//orderByOrderId 
export const orderByOrderId = async (req, res) => {
  try {
    const {orderId} = req.params
    const orders = await orderModel.findById(orderId).populate({
      path: "buyer",
      select: "name address" 
    }).sort({createdAt: -1})
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in getting Order",
      error 
    })
  }
}

//all orders 
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find().populate("products", "-image").populate("buyer", "name").sort({createdAt: -1});
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in getting all Orders",
      error
    })
  }
}

// orders status
export const orderStatusController = async (req, res) => {
  try {
    const {orderId} = req.params
    const {status} = req.body
    const orders = await orderModel.findByIdAndUpdate(orderId, {status}, {new: true});
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in updating order status",
      error
    })
  }
}



export const getPrescriptionController = async (req, res) => {
  try {
    const {userId} = req.params;
    //validation

    const prescription = await prescriptionModel.findOne({buyer: userId})
    
    res.status(201).send({
      success: true,
      message: "Get Prescription Successfull",
      prescription
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in Updating",
      error
    })
  }
 }
export const updatePrescriptionStatusController = async (req, res) => {
  try {
    const {status} = req.body;
    const {pid} = req.params;
    console.log(status)
    //validation

    const updatePrescription = await prescriptionModel.findByIdAndUpdate(pid, {status}, {new: true}).select('-image')
    
    res.status(201).send({
      success: true,
      message: "Update Prescription Status Successfull",
      updatePrescription
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in Updating",
      error
    })
  }
 }

export const uploadPrescriptionController = async (req, res) => {
  try {
    const {userId} = req.params;
    const {image} = req.files
    //validation
    
    if(!image){
      return res.send({message: "Image is required and should be less then 1MB"})
    }


    const prescription = new prescriptionModel({buyer: userId}).select("-image")
    if(image){
      prescription.image.data = fs.readFileSync(image.path)
      prescription.image.contentType = image.type
    }
    await prescription.save()
    res.status(201).send({
      success: true,
      message: "Upload Prescription Successfull",
      prescription
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in Uploading",
      error
    })
  }
 }

 //getPhoto
export const getPrescriptionPhoto = async (req, res) => {
  try {
    const {pid} = req.params
    const prescription = await prescriptionModel.findById(pid).select('image')
    if(prescription.image.data){
      res.set('Content-type', prescription.image.contentType);
      res.status(200).send(prescription.image.data)
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error while getting image",
      error: error.message
    })
  }
}



export const testController = (req, res) => {
  res.send("protected route")
}
