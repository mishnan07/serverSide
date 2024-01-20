import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
   
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }, 
    stock:{
        type:Number,
        required:true
    },
   
})

export const ProductModel = mongoose.model('Product', productSchema);





