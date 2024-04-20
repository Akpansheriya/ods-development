const { Sequelize } = require("sequelize");
const Database = require("../../../config/connection");
const Vaccination = Database.vaccination;
const Pet = Database.pet;
const Vaccine = Database.vaccine;
const jwt = require("jsonwebtoken")
const Owner = Database.owner;
const Admin = Database.user
const petVaccination = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const id = req.params.id;

    const vaccinations = await Vaccination.findAll({
      where:{unique},
      include: [
        {
          model: Pet,
          as: "petVaccinationData",
          attributes: ["Species"],
        },
      ],
      order: [["createdAt", "DESC"]],
      where: { petId: id },
    });

    const vaccines = await Vaccine.findAll({where:{unique}})
    const formattedVaccinations = vaccinations.map((vaccination) => {
      // Find the corresponding vaccine object in the vaccines array
      const vaccine = vaccines.find((v) => v.id === vaccination.vaccineId);

      // Map the vaccination data to the desired format
      return {
        id: vaccination.id,
        petId: vaccination.petId,
        vaccineId: vaccination.vaccineId,
        owner: vaccination.owner,
        pet: vaccination.pet,
        vaccine: vaccine?.name, // Assign the found vaccine object
        exploration: vaccination.exploration,
        F_vaccination: vaccination.F_vaccination,
        validity: vaccination.validity,
        status: vaccination.status,
        ownerId: vaccination.ownerId,
        createdAt: vaccination.createdAt,
        updatedAt: vaccination.updatedAt,
        Species: vaccination.petVaccinationData?.Species || null,
      };
    });

    res.status(200).send({
      message: "vaccination",
      vaccinations: formattedVaccinations,
    });
  } catch (error) {
    console.error("Error fetching vaccination data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const createVaccineRecord = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const id = req.params.id;
    const pet = await Pet.findByPk(id, {
      where:{unique},
      include: [
        {
          model: Owner,
          as: "ownerByPet",
        },
      ],
    });
    
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    const owner = pet.ownerByPet;
    if (!owner) {
      return res.status(404).json({ message: "Owner not found for the pet" });
    }

    const { vaccine, vaccineId } = req.body;

    const vaccineRecord = await Vaccination.create({
      owner: owner.name,
      ownerId: owner.id,
       petId:id,
      vaccine,
      vaccineId,
      status:"pending",
      exploration:"APTO",
      F_vaccination:null,
validity:null,

    });

    res.status(200).json({
      message: "Vaccine record created successfully",
      vaccineRecord,
    });
  } catch (error) {
    console.error("Error creating vaccine record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createVaccination = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const vaccination = {
      vaccineId: req.body.vaccineId,
      unique:unique,
      petId: req.body.petId,
      ownerId: req.body.ownerId,
      owner: req.body.owner,
      pet: req.body.pet,
      status: "pending",
      vaccine: req.body.vaccine,
      exploration: "APTO",
      validity: new Date(req.body.validity),
      F_vaccination: new Date(req.body.F_vaccination),
      validity: req.body.validity,
    };

    await Vaccination.create(vaccination).then((result) => {
      return res.status(201).json({
        message: "vaccination created",
        result: result,
      });
    });
  } catch (error) {
    res.status(500).send({
      message: "Error vaccination creation",
      error: error.message,
    });
  }
};

const updateVaccination = async (req, res) => {
  try {
    const id = req.params.id;
    const vaccination = {
      vaccineId: req.body.vaccineId,
      petId: req.body.petId,
      ownerId: req.body.ownerId,
      owner: req.body.owner,
      pet: req.body.pet,

      vaccine: req.body.vaccine,
    };

    await Vaccination.update(vaccination, { where: { id: id } }).then(
      (result) => {
        return res.status(200).json({
          message: "vaccination updated successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).send({
      message: "Error vaccination creation",
      error: error.message,
    });
  }
};

const vaccinationList = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const unique = decoded.unique;
  const vaccination = await Vaccination.findAll({where:{unique}});
  res.status(200).send({
    message: "vaccinationList",
    vaccination,
  });
};
const vaccinationsById = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const vaccination = await Vaccination.findAll({
      include: [
        {
          model: Pet, 
          as: "petVaccinationData",
          attributes: ["Species", "name", "owner"],
        },
      ],
      where: { vaccineId: req.params.vaccineId , unique },
    });

    res.status(200).send({
      message: "vaccinations",
      vaccination,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
const updateVaccinationStatus = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const id = req.params.id;
    const status = req.body.status;
    const vaccination = {
      status: status,
      exploration:
        req.body.status === "pending" || req.body.status === "vaccinated"
          ? "APTO"
          : "NO APTO",
    };
    await Vaccination.update(vaccination, { where: { id: id ,unique} }).then(
      (result) => {
        return res.status(200).json({
          message: "vaccination updated successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).send({
      message: "Error vaccination creation",
      error: error.message,
    });
  }
};
const updateVaccinationValidity = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const id = req.params.id;
    const F_vaccination = new Date(req.body.F_vaccination);
    const validity = new Date(req.body.validity);
    const vaccination = {
      F_vaccination: F_vaccination,
      validity: validity,
    };
    await Vaccination.update(vaccination, { where: { id: id ,unique} }).then(
      (result) => {
        return res.status(200).json({
          message: "vaccination validity updated successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).send({
      message: "Error vaccination creation",
      error: error.message,
    });
  }
};

const deleteVaccinationRecord = async (req, res) => {
  const id = req.params.id;
  const vaccination = await Vaccination.findOne({ where: { id: id } });
  const {pass,email} = req.body
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
  if (vaccination?.id === id) {
    Vaccination.destroy({ where: { id: id } });
    return res.status(200).send({
      message: "vaccination record deleted successfully",
      success: true,
    });
  }
};
module.exports = {
  createVaccination,
  petVaccination,
  vaccinationsById,
  updateVaccination,
  vaccinationList,
  updateVaccinationStatus,
  updateVaccinationValidity,
  deleteVaccinationRecord,
  createVaccineRecord,
};
