module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
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
name:{
  type: DataTypes.STRING,
  allowNULL: false,
},
    role: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    profile: {
      type: DataTypes.STRING,
    
    },
   identification:{
    type: DataTypes.STRING,
   },

   phone:{
    type: DataTypes.BIGINT,
   
   },
   email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    
  },
    password: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    isverified: {
      type: DataTypes.BOOLEAN,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
    },
    isMasterAdmin: {
      type: DataTypes.BOOLEAN,
    },
    isCustomerService: {
      type: DataTypes.BOOLEAN,
    },
    emailToken:{
      type: DataTypes.STRING,
    }
  });

  return User;
};
