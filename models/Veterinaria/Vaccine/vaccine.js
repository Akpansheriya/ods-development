module.exports = (sequelize, DataTypes) => {
  const Vaccine = sequelize.define("vaccine", {
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
    validity: {
      type: DataTypes.STRING,
      allowNULL: false,
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNULL: false,
    },
  });

  return Vaccine;
};
