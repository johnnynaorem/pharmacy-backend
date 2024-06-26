import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs';
import dotenv from "dotenv"


//configure env
dotenv.config()

//For payment
import braintree from "braintree";
import { error } from "console";
import orderModel from "../models/orderModel.js";

//payment Gateway
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//create Product
export const createProduct = async (req, res) => {
  try {
    const {name, slug, description, price, category, quantity, shipping} = req.fields;
    const {image} = req.files
    //validation----
    switch(true){
      case !name: 
        return res.status(500).send({message: 'Name is required'})
      case !description: 
        return res.status(500).send({message: 'Description is required'})
      case !price: 
        return res.status(500).send({message: 'Price is required'})
      case !category: 
        return res.status(500).send({message: 'Category is required'})
      case !quantity: 
        return res.status(500).send({message: 'Quantity is required'})
      case image && image.size < 10000: 
        return res.status(500).send({message: 'Image is required and should be less then 1MB'})
    }
    const product = new productModel({...req.fields, slug: slugify(name)})
    if(image){
      product.image.data = fs.readFileSync(image.path)
      product.image.contentType = image.type
    }
    await product.save()
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in Product",
      error: error.message
    })
  }
}

//updateProduct
export const updateProduct = async (req, res) => {
  try {
    const {name, slug, description, price, category, quantity, shipping} = req.fields;
    const {image} = req.files
    //validation----
    switch(true){
      case !name: 
        return res.status(500).send({message: 'Name is required'})
      case !description: 
        return res.status(500).send({message: 'Description is required'})
      case !price: 
        return res.status(500).send({message: 'Price is required'})
      case !category: 
        return res.status(500).send({message: 'Category is required'})
      case !quantity: 
        return res.status(500).send({message: 'Quantity is required'})
      case image && image.size < 10000: 
        return res.status(500).send({message: 'Image is required and should be less then 1MB'})
    }
    const product = await productModel.findByIdAndUpdate(req.params.id, {
      ...req.fields, slug: slugify(name)}, {new: true}
      ).select('-image')
    if(image){
      product.image.data = fs.readFileSync(image.path)
      product.image.contentType = image.type;
      await product.save();
    }
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      product
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error while Updating Product",
      error: error.message
    })
  }
}
// export const updateProduct = async (req, res) => {
//   try {
//     const {name, slug, description, price, category, quantity, shipping} = req.fields;
//     const {image} = req.files
//     //validation----
//     // switch(true){
//     //   case !name: 
//     //     return res.status(500).send({message: 'Name is required'})
//     //   case !description: 
//     //     return res.status(500).send({message: 'Description is required'})
//     //   case !price: 
//     //     return res.status(500).send({message: 'Price is required'})
//     //   case !category: 
//     //     return res.status(500).send({message: 'Category is required'})
//     //   case !quantity: 
//     //     return res.status(500).send({message: 'Quantity is required'})
//     //   case image && image.size < 10000: 
//     //     return res.status(500).send({message: 'Image is required and should be less then 1MB'})
//     // }
//     const product = await productModel.findByIdAndUpdate(req.params.id, {
//       ...req.fields, slug: slugify(name)}, {new: true}
//       ).select('-image')
//     if(image){
//       product.image.data = fs.readFileSync(image.path)
//       product.image.contentType = image.type;
//       // await product.save();
//     }
//     res.status(201).send({
//       success: true,
//       message: "Product Updated Successfully",
//       product
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(500).send({
//       success: false,
//       message: "Error while Updating Product",
//       error: error.message
//     })
//   }
// }

//getAllProduct
export const getAllProduct = async (req, res) => {
  try {
    const products = await productModel.find({}).populate('category').select("-image").sort({createdAt: -1})
    res.status(200).send({
      success: true,
      message: "Fetch All the Products",
      totalCount: products.length,
      products
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error While Fetching All Product",
      error: error.message
    })
  }
}

//getSingleProduct
export const getSingleProduct = async (req, res) => {
  try {
    const {slug} = req.params
    const product = await productModel.findOne({slug}).populate('category').select("-image").sort({createdAt: -1})
    if(!product || product.length === 0){
      return res.status(404).send({
        success: false,
        message: "Product Not Found"
      })
    }
    res.status(200).send({
      success: true,
      message: "Fetch the Product",
      product
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({  
      success: false,
      message: "Error while Fetching Product",
      error: error.message
    })
  }
}
//getPhoto
export const getPhoto = async (req, res) => {
  try {
    const {pid} = req.params
    if(pid){
      const product = await productModel.findById(pid).select('image')
      if(product.image.data){
        res.set('Content-type', product.image.contentType);
        res.status(200).send(product.image.data)
      }
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

//deleteProduct
export const deleteProduct = async (req, res) => {
  try {
    const {id} = req.params
    const product = await productModel.findByIdAndDelete(id)
    if(!product || product.length === 0){
      return res.status(404).send({
        success: false,
        message: "Product Not Found"
      })
    }
    res.status(200).send({
      success: true,
      message: "Deleted the Product",
      product
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error while Deleting Product",
      error: error.message
    })
  }
}

export const productFilter = async (req, res) => {
  try {
    const {checked} = req.body;
    let payload = {};
    if(checked){
      payload.category = checked  
    }
    const product = await productModel.find(payload);
    res.status(200).send({
      success: true,
      message: 'Fetching the filter Products',
      product
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Filtering Products",
      error: error.message
    })
  }
}

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find().estimatedDocumentCount()
    res.status(200).send({
      success: true,
      total
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Counting Products",
      error: error.message
    })
  }
}

export const productListController = async (req, res) => {
  try {
    const perPage = 5
    const page = req.params.page ? req.params.page : 1
    const products = await productModel.find().populate('category').select('-image').skip((page-1) * perPage).limit(perPage).sort({createdAt: -1})
    res.status(200).send({
      success: true,
      products
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Products Listing",
      error: error.message
    })
  }
}

export const productBestSellingController = async (req, res) => {
  try {
    const products = await productModel.find({bestSelling: true}).select('-image').populate('category')
    res.status(200).send({
      success: true,
      products
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while feetching Products",
      error: error.message
    })
  }
}

export const productByCategoryController = async (req, res) => {
  try {
    const {category} = req.params
    const products = await productModel.find({category: category}).select('-image').populate('category').limit(4)
    res.status(200).send({
      success: true,
      products
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while feetching Products",
      error: error.message
    })
  }
}

export const productSearchController = async (req, res) => {
  try {
    const {keyword} = req.params;
    const products = await productModel.find({
      $or: [
        {name: {$regex: keyword, $options: "i"}},
        {description: {$regex: keyword, $options: "i"}}
      ]
    }).select("-image");
    res.json(products)
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Products Searching",
      error: error.message
    })
  }
}

export const productRelatedController = async (req, res) => {
  try {
    const {pid, cid} = req.params;
    const results = await productModel.find({
      category: cid,
      _id: {$ne: pid}
    }).select("-image").populate('category').limit(3)
    res.status(200).send({
      success: true,
      results
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While fetching related data",
      error: error.message
    })
  }
}

//payment token gateway api
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function(error, response){
      if(error) {
        res.status(500).send(error)
      } else {
        res.send(response)
      }
    })
  } catch (error) {
    console.log(error);
  }
}

//payment api
export const braintreePaymentController = async (req, res) => {
  try {
    const {cart, nonce, billingAddress} = req.body
    console.log(req.body)
    let total = 0;  
    cart.map(item => total += item.price * item.quantity);
    let newTransaction = gateway.transaction.sale({
      amount: total,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true
      }
    },
    function(err, result){
      if(result){
        const order = new orderModel({
          products: cart,
          payment: result,
          buyer: req.user._id,
          shippingAddress: billingAddress
        }).save()
        res.json({ok: true})
      } else {
        res.status(500).send(err)
      }
    })
  } catch (error) {
    console.log(error)
  }
}