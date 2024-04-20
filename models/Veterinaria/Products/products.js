module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("product", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    unique: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    categoryId: {
      type: DataTypes.STRING,
      allowNULL: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    category: {
      type: DataTypes.STRING,
      allowNULL: false,
     foreignKey:true
    },
    product: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    composition: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNULL: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    price:{
      type: DataTypes.INTEGER,
      allowNULL: false,
    },
    presentation: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    sku: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    laboratory: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNULL: false,
    },
   
    reason: {
      type: DataTypes.STRING,
    
    },
  });
 
  
  return Product;
};
