
import { CategoryModel } from "../Models/categoryModel.js";
import { ProductModel } from "../Models/productModel.js";

// Add a new category
export const addCategory = async (req, res) => {
    try {
        const { name, parent } = req.body;

        // Create a new category instance
        const category = new CategoryModel({
            name: name,
            parent: parent
        });

        // Save the category to the database
        await category.save();

        // If the category has a parent, update the parent's subcategories array
        if (parent) {
            await CategoryModel.updateOne(
                { _id: parent },
                { $push: { subcategories: category._id } }
            );
        }

        // Respond with a success message
        res.status(200).json({ message: 'Category added successfully' });
    } catch (error) {
        // Handle errors and respond with an error message
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all categories
export const getCategory = async (req, res) => {
    try {
        // Retrieve all categories from the database
        const data = await CategoryModel.find({});

        // Respond with the list of categories
        res.json({ data });
    } catch (error) {
        // Handle errors and respond with an error message
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all categories in a tree-like structure
export const getAllCategories = async (req, res) => {
    try {
        const categoryTree = await buildCategoryTree(null);

        // Respond with the category tree
        res.json(categoryTree);
    } catch (error) {
        // Handle errors and respond with an error message
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Recursively build a category tree
const buildCategoryTree = async (parent) => {
    const categories = await CategoryModel.find({ parent }).populate('subcategories');
    const categoryTree = [];

    for (const category of categories) {
        // Build children and get product count for each category
        const children = await buildCategoryTree(category._id);
        const productCount = await getProductCount(category._id);

        // Add the category and its information to the tree
        categoryTree.push({
            _id: category._id.toString(),
            name: category.name,
            subcategories: category.subcategories.map(subcategory => subcategory._id.toString()),
            parent: category.parent ? category.parent.toString() : null,
            children,
            productCount,
        });
    }

    return categoryTree;
};

// Get the count of products for a given category and its subcategories
const getProductCount = async (categoryId) => {
    try {
        const categoryTree = [categoryId];

        const buildCategoryTree = async (parent) => {
            const categories = await CategoryModel.find({ parent }).populate('subcategories');

            for (const category of categories) {
                categoryTree.push(category._id.toString());
                await buildCategoryTree(category._id);
            }
        };

        await buildCategoryTree(categoryId);

        const productCount = await ProductModel.countDocuments({ category: { $in: categoryTree } });


        return productCount;
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

