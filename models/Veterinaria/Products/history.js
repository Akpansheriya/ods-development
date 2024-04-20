module.exports = (sequelize, DataTypes) => {
    const History = sequelize.define("history", {
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
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
     
      stock: {
        type: DataTypes.INTEGER,
        allowNULL: false,
      },
     
     
      reason: {
        type: DataTypes.STRING,
        allowNULL: false,
      },
    });
   
    
    return History;
  };
  