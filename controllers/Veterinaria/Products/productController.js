const { Op } = require("sequelize");
const Database = require("../../../config/connection")
const Product = Database.product;
const History = Database.history
const Admin = Database.user;
const jwt = require("jsonwebtoken")
const ExcelJS = require("exceljs");
const createProduct = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    console.log(unique)
    const {
      product,
      categoryId,
      category,
      brand,
      composition,
      stock,
      status,
      price,
      presentation,
      sku,
      laboratory,
      description,
    } = req.body;

    if (!product) {
      res.status(400).send({ message: "Product is required" });
    } else if (!brand) {
      res.status(400).send({ message: "Brand is required" });
    } else if (!stock) {
      res.status(400).send({ message: "Stock is required" });
    } else if (!sku) {
      res.status(400).send({ message: "SKU is required" });
    } else if (!status) {
      res.status(400).send({ message: "Status is required" });
    } else {
      const newProduct = {
        product,
        categoryId,
        unique,
        category: category || null,
        brand,
        composition: composition || null,
        stock,
        status,
        price,
        presentation,
        sku,
        laboratory: laboratory || null,
        description: description || null,
      };
console.log(newProduct)
      const result = await Product.create(newProduct);
      res.status(201).json({ message: "Product created", result });
    }
  } catch (error) {
    res.status(500).send({ message: "Error product creation", error: error.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const productExist = await Product.findOne({ where: { id: id } });

    const product = {
      product: req.body.product,
      category: req.body.category,
      brand: req.body.brand,
      composition: req.body.composition,
      stock: req.body.stock,
      status: req.body.status,
      price: req.body.price,
      presentation: req.body.presentation,
      sku: req.body.sku,
      laboratory: req.body.laboratory,
      description: req.body.description,
      reason: "",
    };

    if (productExist) {
      if (product.product === "" || product.product === null) {
        res.status(400).send({
          message: "product is required",
        });
      } else if (product.brand === "" || product.brand === null) {
        res.status(400).send({
          message: "brand is required",
        });
      } else if (product.stock === "" || product.stock === null) {
        res.status(400).send({
          message: "stock is required",
        });
      } else if (product.sku === "" || product.sku === null) {
        res.status(400).send({
          message: "sku is required",
        });
      } else if (product.status === "" || product.status === null) {
        res.status(400).send({
          message: "status is required",
        });
      }else {
        await Product.update(product, { where: { id: id } });
        res.status(200).send({
          message: "product updated successfully",
        });
      }
     
    } else {
      res.status(404).send({
        message: "product not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating category",
      error: error.message,
    });
  }
};
const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findOne({ where: { id: id } });
  const { pass, email } = req.body;
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
  if (product?.id === id) {
    await Product.destroy({ where: { id: id } });
    await History.destroy({where:{productId : id}})
    return res.status(200).send({
      message: "product deleted successfully",
      success: true,
    });
  } else {
    return res.status(404).send({
      message: "product record not found",
      success: false,
    });
  }
};

const getAllProducts = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const unique = decoded.unique;
  const productList = await Product.findAll({where:{unique}});
  res.status(200).send({
    message: "productsList",
    productList,
  });
};
const getSingleProduct = async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const unique = decoded.unique;
  const product = await Product.findAll({ where: { id: id , unique} });
  res.status(200).send({
    message: "products",
    product,
  });
};
const updateProductStock = async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const unique = decoded.unique;
  const products = await Product.findOne({
    where: { id: id ,unique},
  });

  const product = {
    stock: products?.stock + req.body.stock,
    reason: req.body.reason,
   status:products?.stock === 0 && req.body.stock > 0 ? "active" : "inactive"
  };
  const history = {
    productId :products?.id,
    stock:req.body.stock,
    reason: req.body.reason,
  }
  if (products) {
    if (product.stock === "" || product.stock === null) {
      res.status(400).send({
        message: "stock is required",
      });
    }else if (product.reason === "" || product.reason === null) {
      res.status(400).send({
        message: "reason is required",
      });
    }else {
      await History.create(history)
    await Product.update(product, { where: { id: id } });
    res.status(200).send({
      message: "stock updated successfully",
    });
    }
    
  } else {
    res.status(404).send({
      message: "product not found",
    });
  }
};

const getProductHistory = async (req,res) => {
  const id = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const unique = decoded.unique;
  const productHistory = await History.findAll({ where: { productId: id , unique}, order: [
          ['createdAt', 'DESC']
        ], });
  res.status(200).send({
    message: "productHistory",
    productHistory,
  });
}
const productFilter = async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const status = req.query.status ? req.query.status : "";
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
   
    if (req.query.startDate && req.query.endDate && req.query.status) {
      const filteredRecords = await Product.findAll({
        where: {
          status,
          unique,
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      res.status(200).json({
        message: "Filtered records",
        productList: filteredRecords,
      });
    } else if (req.query.startDate && req.query.endDate && !req.query.status) {
      const filteredRecords = await Product.findAll({
        where: {
          unique,
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      res.status(200).json({
        message: "Filtered records",
        productList: filteredRecords,
      });
    } else if (req.query.status && !req.query.startDate && !req.query.endDate) {
      const filteredRecords = await Product.findAll({
        where: {
          unique,
          status,
        },
      });

      res.status(200).json({
        message: "Filtered records",
        productList: filteredRecords,
      });
    } else if (!req.query.status && !req.query.startDate && !req.query.endDate) {
      const productList = await Product.findAll({where:{unique}, order: [["createdAt", "DESC"]], });
      res.status(200).send({
        message: "productList",
        productList,
      });
    }
  } catch (error) {
    console.error("Error filtering records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const productExcelFile = async (req, res) => {
  try {
    const ProductData = await Product.findAll({});
    
    if (ProductData.length > 0) {
      const plainProductData = ProductData.map((product) => {
        const formattedProduct = product.get({ plain: true });

        // Rename headers
        formattedProduct.SKU = formattedProduct.sku;
        formattedProduct.Poducto = formattedProduct.product;
        formattedProduct.Presentación = formattedProduct.presentation;
        formattedProduct.Precio = formattedProduct.price;
        formattedProduct.Categoria = formattedProduct.category;
        formattedProduct.Stock = formattedProduct.stock;
        formattedProduct.Estado = formattedProduct.status;
      

        // Remove unwanted fields
        const unwantedFields = [
          "createdAt",
          "updatedAt",
          "id",
          "categoryId",
          "category",
          "product",
          "brand",
          "composition",
          "laboratory",
          "stock",
          "status",
          "sku",
          "description",
          "reason",
          "price",
          "presentation",
        ];
        unwantedFields.forEach((field) => delete formattedProduct[field]);

        return formattedProduct;
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("products");
  
      // Add merged cells for title and image
      worksheet.mergeCells("A1:B2");
      const titleCell = worksheet.getCell("A1");
      titleCell.value = "Lista De Productos";
      titleCell.font = { size: 16, bold: true };
      titleCell.alignment = { vertical: "middle", horizontal: "left" };
  
      worksheet.mergeCells("C1:D2");
      const imageId = workbook.addImage({
        filename: "./public/ods.png",
        extension: "png",
      });
      worksheet.addImage(imageId, {
        tl: { col: 2, row: 0 },
        br: { col: 4, row: 2 },
      });
  
      // Set border style for blank space
      worksheet.getCell("B1").border = {
        right: { style: "thin", color: { argb: "FFFFFF" } },
      };
      worksheet.getCell("B2").border = {
        right: { style: "thin", color: { argb: "FFFFFF" } },
      };
  
      // Write headers to the worksheet
      const headers = Object.keys(plainProductData[0]);
      worksheet.addRow(headers);
  
      // Write data to the worksheet
      plainProductData.forEach((product) => {
        const row = [];
        headers.forEach((header) => {
          row.push(product[header]);
        });
        worksheet.addRow(row);
      });
  
      // Format header row
      worksheet.getRow(4).eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDDDDD" } };
        cell.font = { size: 11, bold: true };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });
  
      // Format data rows
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 3) {
          row.eachCell((cell) => {
            cell.alignment = { vertical: "middle", horizontal: "center" };
          });
        }
      });
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 3) {
          row.eachCell((cell) => {
            cell.alignment = { vertical: "middle", horizontal: "center" };
          });
          const estadoCell = row.getCell("G"); // Assuming "Estado" is in column H (8th column)
          if (estadoCell.value === "activo") {
            estadoCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9EFFF" } }; // Blue color
            estadoCell.font = { color: { argb: "2F75B5" } }; // White font color
          } else if (estadoCell.value === "inactivo") {
            estadoCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FCE4D6" } }; // Light red color
            estadoCell.font = { color: { argb: "FF0000" } }; // Dark red font color
          }
        }
      });
      // Set row height
      worksheet.eachRow((row) => {
        row.height = 21.75;
      });
  
      // Set column widths
      worksheet.getColumn(1).width = 15.41;
      worksheet.getColumn(2).width = 20.41;
      worksheet.getColumn(3).width = 15.41;
      worksheet.getColumn(4).width = 20;
      worksheet.getColumn(5).width = 20;
      worksheet.getColumn(6).width = 20;
      worksheet.getColumn(7).width = 28;
      worksheet.getColumn(8).width = 20;
  
      // Prepare the Excel file for download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=product.xlsx");

      // Write the workbook data to the response
      await workbook.xlsx.write(res);
      res.end();
    } else {
      res.status(404).send({
        message: "Data not found",
      });
    }
  } catch (error) {
    console.error("Error exporting Excel file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
}
const updateProductStatus = async () => {
  try {
  

    await Product.update(
      { status: "inactive" },
      {
        where: {
          stock: 0,
        
        },
      }
    );
  } catch (error) {
    console.error("Error updating appointments:", error);
  }
};






module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  productFilter,
  productExcelFile,
  updateProductStock,
  getProductHistory,
  updateProductStatus,
  getSingleProduct,
};
