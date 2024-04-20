const { Sequelize } = require("sequelize");
const Database = require("../../../config/connection");
const Speciality = Database.speciality;
const Admin = Database.user;
const Veterinarian = Database.veterinarian;
const Appointment = Database.appointment;
const jwt = require("jsonwebtoken")

const createSpeciality = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    console.log(unique)
    const { speciality } = req.body;
    
    if (!speciality) {
      return res.status(400).json({
        message: "Speciality is required",
      });
    }

    const exist = await Speciality.findOne({ where: { speciality,unique:unique } });

    if (exist) {
      return res.status(400).json({
        message: "Speciality already exists",
      });
    }

    const newSpeciality = await Speciality.create({ speciality,unique:unique });
    return res.status(201).json({
      message: "Speciality created",
      result: newSpeciality,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error creating speciality",
      error: error.message,
    });
  }
};


const updateSpeciality = async (req, res) => {
  try {
    const id = req.params.id;
    const specialityExist = await Speciality.findOne({ where: { id: id } });

    const { speciality } = req.body;
if(speciality === "" || speciality === undefined) {
  res.status(400).send({
    message: "speciality required ",
  });
}
    if (specialityExist) {
      await Speciality.update({ speciality }, { where: { id: id } });
      await Veterinarian.update({speciality},{where: {specialityId:id}})
      res.status(200).send({
        message: "speciality updated successfully",
      });
    } else {
      res.status(404).send({
        message: "speciality not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating speciality",
      error: error.message,
    });
  }
};
const deleteSpeciality = async (req, res) => {
  const id = req.params.id;
  const speciality = await Speciality.findOne({ where: { id: id } });
  const { pass, email } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const user = await Admin.findOne({
    where: { email: email },
  });
  if (pass !== user.password) {
    return res.status(400).send({
      message: "password not match",
      success: false,
    });
  }
  if (decoded.role !== user.role) {
    return res.status(400).send({
     message: "Not authorized",
     success: false,
   });
 }
  if (speciality?.id === id) {
    await Speciality.destroy({ where: { id: id } });
    await Veterinarian.destroy({where:{specialityId:id}})
    const vets = await Veterinarian.findAll({where:{veterinarianId:id}})
    const veterinarianIds = vets.map((vet) => vet.id);
    await Appointment.destroy({
      where: {
        veterinarianId: {
          [Sequelize.Op.in]: veterinarianIds,
        },
      },
    });
    return res.status(200).send({
      message: "speciality deleted successfully",
      success: true,
    });
  } else {
    return res.status(404).send({
      message: "speciality record not found",
      success: false,
    });
  }
};

const getAllSpecialities = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const unique = decoded.unique;
  const specialityList = await Speciality.findAll({where:{unique} ,order: [["createdAt", "DESC"]], });
  res.status(200).send({
    message: "specialityList",
    specialityList,
  });
};

const getSingleSpeciality = async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const unique = decoded.unique;
  const speciality = await Speciality.findOne({ where: { id: id ,unique} });
  res.status(200).send({
    message: "speciality",
    speciality,
  });
};
const getVeterinariansBySpeciality = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const specialities = await Speciality.findAll({
      where: { unique },
      include: {
        model: Veterinarian,
        as: "specialityData",
      },
      attributes: [
        "id",
        "speciality",
        "unique",
        "createdAt",
        [Sequelize.fn("COUNT", Sequelize.col("specialityData.id")), "veterinarianCount"],
        [Sequelize.literal("MIN(specialityData.id)"), "veterinarianId"], // Use MIN function to retrieve the first value
      ],
      group: [
        "speciality.id",
        "speciality.unique",
        "speciality.speciality",
        "speciality.createdAt",
      ],
    });

    res.status(200).send({
      message: "Specialities",
      specialities: specialities.map((ele) => ({
        id: ele.id,
        speciality: ele.speciality,
        createdAt: ele.createdAt,
        veterinarianCount: ele.specialityData.length,
        veterinarianId: ele.veterinarianId,
      })),
    });
  } catch (error) {
    console.error("Error fetching speciality data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  createSpeciality,
  updateSpeciality,
  deleteSpeciality,
  getAllSpecialities,
  getSingleSpeciality,
  getVeterinariansBySpeciality,
};
