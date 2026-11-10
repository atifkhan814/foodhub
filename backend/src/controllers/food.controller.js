
import Food from "../models/Food.models.js";
import cloudinary from "../config/cloudinary.js";

// Upload image buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "foodhub",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

// Get all food items
export const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find();

    res.status(200).json({
      success: true,
      data: foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add a new food item
export const createFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    let imageUrl = "";

    // Upload image if one was provided
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // Handle prices such as "$12.50" or "12.50"
    const numericPrice = Number(
      String(price).replace(/^\$/, "")
    );

    const food = await Food.create({
      name,
      description,
      price: numericPrice,
      category,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Food created successfully",
      data: food,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update an existing food item
export const updateFood = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

    // Normalize price if it was provided
    if (updateData.price !== undefined) {
      updateData.price = Number(
        String(updateData.price).replace(/^\$/, "")
      );
    }

    // Upload a new image only if one was selected
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.image = result.secure_url;
    }

    const updatedFood = await Food.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedFood) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food updated successfully",
      data: updatedFood,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a food item
export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFood = await Food.findByIdAndDelete(id);

    if (!deletedFood) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food deleted successfully",
      data: deletedFood,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
