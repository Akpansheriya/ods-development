module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define("appointment", {
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
    owner: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    status: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    pet: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    petId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    veterinarian: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    veterinarianId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    date: {
      type: DataTypes.DATE,
      allowNULL: false,
    },
    scheduleStart: {
      type: DataTypes.TIME,
      allowNULL: false,
    },
    scheduleEnd: {
      type: DataTypes.TIME,
      allowNULL: false,
    },
    observation: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    condition_name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    documentation: {
      type: DataTypes.JSON, 
    
    },
    medication: {
      type: DataTypes.JSON, 
    
    },

    internal_observation: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.INTEGER,
    },
  });

  return Appointment;
};
