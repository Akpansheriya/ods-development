module.exports = (sequelize, DataTypes) => {
    const Pet = sequelize.define("pet", {
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
      ownerId:{
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNULL: false,
      },
      owner: {
        type: DataTypes.STRING,
        allowNULL: false,
       
      },
      sex: {
        type: DataTypes.STRING,
        allowNULL: false,
      },
  
      dob: {
        type: DataTypes.DATE,
      },
     age:{
      type: DataTypes.INTEGER,
     },
      Species: {
        type: DataTypes.STRING,
      
      },
      breed: {
        type: DataTypes.STRING,
      
      },
    
      color: {
        type: DataTypes.STRING,
      },
      status:{
        type: DataTypes.STRING,
      },
      exploration:{
        type: DataTypes.STRING,
      }
     
    });
    Pet.associate = (models) => {
      Pet.hasMany(models.Vaccination, {
        foreignKey: 'petId', // Make sure this matches the actual foreign key in your Vaccination model
        as: 'petVaccinationData',
      });
    };
    return Pet;
  };
  