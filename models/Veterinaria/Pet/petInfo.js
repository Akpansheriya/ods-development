module.exports = (sequelize, DataTypes) => {
    const PetInfo = sequelize.define("petInfo", {
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
      petId:{
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      pdf: {
        type: DataTypes.STRING,
        allowNULL: false,
      },
      qrImage: {
        type: DataTypes.STRING,
        allowNULL: false,
       
      }
     
    });
   
    return PetInfo;
  };
  