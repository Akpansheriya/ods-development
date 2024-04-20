const { Sequelize, DataTypes } = require("sequelize");
const connect = require("./conn");


const sequelize = new Sequelize(
  connect.DATABASE,
  connect.USER,
  connect.password,

  {
    host: connect.HOST,
    port: connect.port,
    dialect: connect.dialect,
    operatorsAliases: false,

    pool: {
      max: connect.pool.max,
      min: connect.pool.min,
      acquire: connect.pool.acquire,
      idle: connect.pool.idle,
    },
  }
);
try {
 
    sequelize.authenticate();
    console.log("connection established");
  
 
} catch (error) {
  console.log(error);
}

const Database = {};

//------------------ vets ---------------------//

Database.user = require("../models/Veterinaria/Admin/users")(
  sequelize,
  DataTypes
);
Database.payment = require("../models/Veterinaria/Payment/payment")(
  sequelize,
  DataTypes
);
Database.category = require("../models/Veterinaria/Products/category")(
  sequelize,
  DataTypes
);
Database.product = require("../models/Veterinaria/Products/products")(
  sequelize,
  DataTypes
);
Database.history = require("../models/Veterinaria/Products/history")(
  sequelize,
  DataTypes
);
Database.vaccine = require("../models/Veterinaria/Vaccine/vaccine")(
  sequelize,
  DataTypes
);
Database.owner = require("../models/Veterinaria/Owner/owner")(
  sequelize,
  DataTypes
);
Database.pet = require("../models/Veterinaria/Pet/pet")(
  sequelize,
  DataTypes
);
Database.appointment =
  require("../models/Veterinaria/Appointment/appointment")(
    sequelize,
    DataTypes
  );
Database.speciality =
  require("../models/Veterinaria/Veterinarian/speciality")(
    sequelize,
    DataTypes
  );
Database.veterinarian =
  require("../models/Veterinaria/Veterinarian/veterinarian")(
    sequelize,
    DataTypes
  );
Database.vaccination =
  require("../models/Veterinaria/vaccination/vaccination")(
    sequelize,
    DataTypes
  );
Database.petInfo = require("../models/Veterinaria/Pet/petInfo")(
  sequelize,
  DataTypes
);
Database.sequelize = sequelize;

Database?.category?.hasMany(Database.product, {
  foreignKey: "categoryId",
  as: "categoryData",
});
Database?.speciality?.hasMany(Database.veterinarian, {
  foreignKey: "specialityId",
  as: "specialityData",
});
Database?.owner?.hasMany(Database.pet, {
  foreignKey: "ownerId",
  as: "ownerData",
});
Database?.veterinarian?.hasMany(Database.appointment, {
  foreignKey: "veterinarianId",
  as: "vetsAppointment",
});
Database?.owner?.hasMany(Database.appointment, {
  foreignKey: "ownerId",
  as: "ownerAppointmentData",
});
Database?.pet?.hasMany(Database.appointment, {
  foreignKey: "petId",
  as: "petAppointmentData",
});

Database?.vaccination?.belongsTo(Database.pet, {
  foreignKey: "petId",
  as: "petVaccinationData",
});
Database?.vaccination?.belongsTo(Database.vaccine, {
  foreignKey: "vaccineId",
  as: "vaccineData",
});
Database?.pet?.belongsTo(Database.owner, {
  foreignKey: "ownerId",
  as: "ownerByPet",
});
Database?.vaccine?.hasMany(Database.vaccination, {
  foreignKey: "vaccineId",
  as: "vaccinationData",
});


//-------------------- dentist --------------------------//


// Database = require("../models/Dentista/Admin/users")(
//   sequelize,
//   DataTypes
// );

  Database.sequelize.sync({ force: false }).then(() => {
    console.log("yes sync resync done");
  });




module.exports = { sequelize };
module.exports = Database;
