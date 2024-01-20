import { CategoryModel } from "../Models/categoryModel.js";
import { ProductModel } from "../Models/productModel.js";

// Add a new product
export const addProduct = async (req, res) => {
    try {
        const { productName, price, category, description, stock } = req.body;
        const file = req.files[0].filename;

        // Create a new product instance
        const newProduct = new ProductModel({
            productName,
            price,
            category,
            description,
            image: file,
            stock,
        });

        await newProduct.save();
        res.status(200).json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get products for a selected category and its subcategories
export const getSelectedProducts = async (req, res) => {
    try {
        const categoryId = req.query.categoryId;
        let categoryTree = [];

        categoryTree = [categoryId];

        const buildCategoryTree = async (parent) => {
            const categories = await CategoryModel.find({ parent }).populate('subcategories');

            for (const category of categories) {
                categoryTree = [...categoryTree, category._id.toString()];
                const children = await buildCategoryTree(category._id);
            }
        };

        await buildCategoryTree(categoryId);
        const products = await ProductModel.find({ category: { $in: categoryTree } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all products 
export const getAllProducts =async(req,res)=>{
    try {
        const products = await ProductModel.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}