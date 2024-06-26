import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";


export const categoryController = async (req, res) => {
  try {
    const {name} = req.body;
    if(!name){
      return res.status(401).send({message: "Name is required"})
    }
    const existingCategory = await categoryModel.findOne({name});
    if(existingCategory){
      return res.status(200).send({
        success: true,
        message: "Category Already Exists"
      })
    }
    const category = await new categoryModel({name, slug: slugify(name)}).save();
    res.status(201).send({
      success: true,
      message: "Category Added Successfully",
      category
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category"
    })
  }
}

export const updateCategoryController = async (req, res) => {
  try {
    const {id} = req.params;
    const {name} = req.body
    const updateCategory = await categoryModel.findByIdAndUpdate(id, {name, slug: slugify(name)}, {new: true})
    res.status(200).send({
      success: true,
      message: "Updated Category Successfully",
      updateCategory
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category"
    })
  }
}

export const getAllCategory = async (req, res) => {
  try {
    const category = await categoryModel.find()
    res.status(200).send({
      success: true,
      message: "Fetch All Categories",
      totalCount: category.length,
      category
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category"
    })
  }
}

export const getSingleCategory = async (req, res) => {
  try {
    const {slug} = req.params
    const category = await categoryModel.findOne({slug})
    if(!category || category.length === 0){
      return res.status(404).send({
        success: false,
        message: "Category not found"
      })
    }
    res.status(200).send({
      success: true,
      message: "Fetch Category",
      category
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category"
    })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const deleteCategory = await categoryModel.findByIdAndDelete(req.params.id);
    if(!deleteCategory || deleteCategory.length === 0){
      return res.status(404).send({
        success: false,
        message: "Category Not Found"
      })
    }
    res.status(200).send({
      success: true,
      message: "Deleted Category Successfully",
      deleteCategory
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category"
    })
  }
}