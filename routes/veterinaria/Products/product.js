const express = require("express");
const router = express.Router();

const productController = require("../../../controllers/Veterinaria/Products/productController")
const categoryController = require("../../../controllers/Veterinaria/Products/categoryController");
const Secure = require("../../../middlewares/secure/secure");


// category
router.get("/categoriesList",Secure(['admin','customerService']), categoryController.getAllCategories)

router.get("/singleCategory/:id",Secure(['admin','customerService']), categoryController.getSingleCategory)
router.get("/productCount",Secure(['admin','customerService']), categoryController.getTotalProductsByCategory)
router.post("/createCategory",Secure(['admin','customerService']), categoryController.createCategory);
router.put("/UpdateCategory/:id",Secure(['admin','customerService']), categoryController.updateCategory);
router.delete("/categoryRemove/:id",Secure(['admin','customerService']), categoryController.deleteCategory);



// product
router.get("/productsList",Secure(['admin','customerService','user']), productController.getAllProducts)
router.get("/singleProduct/:id",Secure(['admin','customerService','user']), productController.getSingleProduct)
router.get("/productHistory/:id",Secure(['admin','customerService','user']), productController.getProductHistory)
router.get("/productExcelSheet",Secure(['admin']), productController.productExcelFile)
router.get("/productFilter",Secure(['admin','customerService','user']), productController.productFilter)
router.post("/createProduct",Secure(['admin','customerService']), productController.createProduct);
router.put("/UpdateProduct/:id",Secure(['admin','customerService']), productController.updateProduct);
router.put("/UpdateStock/:id",Secure(['admin','customerService']), productController.updateProductStock);
router.delete("/productRemove/:id",Secure(['admin','customerService']), productController.deleteProduct);


module.exports = router;