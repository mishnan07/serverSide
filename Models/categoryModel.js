import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { 
         type: String,
         required: true,
         unique: true
        },
  parent: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Category'
         },
  subcategories: [
          { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category' 
          }
        ],
});

export const CategoryModel = mongoose.model('Category', categorySchema);

