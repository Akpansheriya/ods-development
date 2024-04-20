const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Owner = sequelize.define("owner", {
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
      name: {
        type: DataTypes.STRING,
        allowNULL: false,
      
      },
      dob:{
        type: DataTypes.DATE,
        allowNULL: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNULL: false,
      },
      phone_1: {
        type: DataTypes.BIGINT,
        allowNULL: false,
       
      },  phone_2: {
        type: DataTypes.BIGINT,
        allowNULL: false,
        
      },
      doc_identity: {
        type: DataTypes.STRING,
        allowNULL: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        
      },
      address: {
        type: DataTypes.STRING,
        allowNULL: false,
      },
      department: {
        type: DataTypes.STRING,
        allowNULL: false,
      },
      district: {
        type: DataTypes.STRING,
        allowNULL: false,
      },
  
    });
   
   
    return Owner;
  };
  