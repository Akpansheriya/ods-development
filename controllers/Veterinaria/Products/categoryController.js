const { Sequelize } = require("sequelize");
const Database = require("../../../config/connection");
const Category = Database.category;
const Product = Database.product;
const Admin = Database.user
const jwt = require("jsonwebtoken")
const createCategory = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    try {
      const exist = await Category.findOne({where:{category:req.body.category,unique}});
  
      if (req.body.category === "" || req.body.category === null) {
        return res.status(400).json({
          message: "category is required",
        });
      }
  
      if (!exist) {
        const { category } = req.body;
        const newCategory = await Category.create({ category , unique:unique });
        return res.status(201).json({
          message: "category created",
          result: newCategory,
        });
      }
  
      return res.status(400).json({
        message: "category existed",
      });
    } catch (error) {
      return res.status(500).send({
        message: "Error category creation",
        error: error.message,
      });
    }
 
};

const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const categoryExist = await Category.findOne({ where: { id: id } });

    const { category } = req.body;

    if (categoryExist) {
      if (req.body.category === "" || req.body.category === null) {
        return res.status(400).json({
          message: "category is required",
        });
      }
      await Category.update({ category }, { where: { id: id } });
      await Product.update({ category }, { where: { categoryId: id } });
      res.status(200).send({
        message: "category updated successfully",
      });
    } else {
      res.status(404).send({
        message: "category not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating category",
      error: error.message,
    });
  }
};
const deleteCategory = async (req, res) => {
  const id = req.params.id;
  const category = await Category.findOne({ where: { id: id } });
  const {pass,email} = req.body
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const user = await Admin.findOne({
    where: { email: email },
  });
  if (pass !== user.password) {
    return res.status(400).send({
      message: "password not match",
      success: false,
    });
  }
  if (decoded.role !== user.role) {
    return res.status(400).send({
     message: "Not authorized",
     success: false,
   });
 }
  if (category?.id === id) {
    await Category.destroy({ where: { id: id } });
    await Product.destroy({ where: { categoryId: id } });
    const products = await Product.findAll({where:{categoryId:id}})
    const productIds = products.map((product) => product.id);
    await History.destroy({
      where: {
        productId: {
          [Sequelize.Op.in]: productIds,
        },
      },
    });
    return res.status(200).send({
      message: "category deleted successfully",
      success: true,
    });
  } else {
    return res.status(404).send({
      message: "category record not found",
      success: false,
    });
  }
};
const getSingleCategory = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const unique = decoded.unique;
  const id = req.params.id
  const category = await Category.findAll({where:{id:id,unique}});
  res.status(200).send({
    message: "category",
    category,
  });
};
const getAllCategories = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const unique = decoded.unique;
  const categoryList = await Category.findAll({ where:{unique},order: [["createdAt", "DESC"]], });
  res.status(200).send({
    message: "categoriesList",
    categoryList,
  });
};

const getTotalProductsByCategory = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const categories = await Category.findAll({
      where:{unique},
      include: {
        model: Product,
        as: "categoryData",
      },
      attributes: [
        "id",
        "category",
        "createdAt",
        [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("categoryData.id"))), "productCount"],
        // Add other aggregated columns or include them in the GROUP BY clause
      ],
      group: ["category.id", "category.category", "category.createdAt", "categoryData.id"], // Include "categoryData.id" in the GROUP BY clause
    });

    res.status(200).send({
      message: "categories",
      categories: categories.map((ele) => ({
        id: ele.id,
        category: ele.category,
        createdAt: ele.createdAt,
        productCount: ele.categoryData.length,
      })),
    });
  } catch (error) {
    console.error("Error fetching category data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  getTotalProductsByCategory,
};
