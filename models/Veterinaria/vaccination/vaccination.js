module.exports = (sequelize, DataTypes) => {
    const Vaccination = sequelize.define("vaccination", {
      id: {
        type: DataTypes.UUID,
      
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      unique: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      petId: {
        type: DataTypes.UUID,
      
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      vaccineId: {
        type: DataTypes.UUID,
      
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
  owner:{
    type: DataTypes.STRING,
  
  },
  pet:{
    type: DataTypes.STRING,
  
  },
  vaccine:{
    type: DataTypes.STRING,
  
  },
  exploration:{
    type: DataTypes.STRING,
  
  },
  F_vaccination:{
    type: DataTypes.DATE,
  
  },
  validity:{
    type: DataTypes.DATE,
  
  },
  status:{
    type: DataTypes.STRING,
  
  },
      ownerId: {
        type: DataTypes.UUID,
      
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
    });
  
    return Vaccination;
  };
  