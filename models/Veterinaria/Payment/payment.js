module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define("payment", {
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
    payment_no: {
      type: DataTypes.INTEGER,
      allowNULL: false,
    },
    transfer_no: {
      type: DataTypes.INTEGER,
    },
    owner: {
      type: DataTypes.STRING,
    },

    doctor: {
      type: DataTypes.STRING,
    },
    service: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNULL: false,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNULL: false,
    },
    final_amount: {
      type: DataTypes.INTEGER,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  });

  return Payment;
};
