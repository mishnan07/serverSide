import express from 'express'
import { addCategory, getAllCategories, getCategory } from '../Controllers/categoryController.js'
import { upload } from '../Config/multer.js'
import { addProduct, getAllProducts, getSelectedProducts } from '../Controllers/productController.js'

const userRoute = express.Router()

userRoute.post('/addCategory',addCategory)
userRoute.get('/categories',getCategory)
userRoute.get('/getAllCategories',getAllCategories)

userRoute.post('/addProduct',upload.array('image', 1),  addProduct);
userRoute.get('/getSelectedProducts',getSelectedProducts)
userRoute.get('/getAllProducts',getAllProducts)



export default userRoute