module.exports = (sequelize, DataTypes) => {
    const Veterinarian = sequelize.define("veterinarian", {
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
      specialityId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNULL: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNULL: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNULL: false,
      },
      speciality: {
        type: DataTypes.STRING,
        allowNULL: false,
      },
      identity: {
        type: DataTypes.STRING,
        allowNULL: false,
      },
      dob: {
        type: DataTypes.DATE,
        allowNULL: false,
      },
      phone: {
        type: DataTypes.BIGINT,
        allowNULL: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
       
       
      },
      password: {
        type: DataTypes.STRING,
        allowNULL: false,
      },
      sex: {
        type: DataTypes.STRING,
        allowNULL: false,
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
      workingDays: {
        type: DataTypes.STRING, 
        get() {
          return this.getDataValue('workingDays') ? JSON.parse(this.getDataValue('workingDays')) : null;
        },
        set(value) {
          this.setDataValue('workingDays', value ? JSON.stringify(value) : null);
        },
      },
      
      start_time: {
        type: DataTypes.TIME,
        allowNULL: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNULL: false,
      },
      emailToken:{
        type: DataTypes.STRING,
      }
    });
  
    return Veterinarian;
  };
  