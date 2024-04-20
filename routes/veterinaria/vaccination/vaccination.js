const express = require("express");
const router = express.Router();

const vaccinationController = require("../../../controllers/Veterinaria/vaccination/vaccinationController");
const Secure = require("../../../middlewares/secure/secure");



router.post("/createVaccination",Secure(['admin','customerService']), vaccinationController.createVaccination);
router.put("/updateVaccination/:id",Secure(['admin','customerService']), vaccinationController.updateVaccination);
router.post("/createVaccinationRecord/:id",Secure(['admin','customerService']), vaccinationController.createVaccineRecord);
router.put("/updateVaccinationStatus/:id",Secure(['admin','customerService']), vaccinationController.updateVaccinationStatus);
router.put("/updateVaccinationValidity/:id",Secure(['admin','customerService']), vaccinationController.updateVaccinationValidity);
router.delete("/deleteVaccinationRecord/:id",Secure(['admin','customerService']), vaccinationController.deleteVaccinationRecord);
router.get("/petVaccination/:id",Secure(['admin','customerService','user']), vaccinationController.petVaccination);
router.get("/vaccinationList",Secure(['admin','customerService']), vaccinationController.vaccinationList);
router.get("/vaccinationById/:vaccineId",Secure(['admin','customerService']), vaccinationController.vaccinationsById);
module.exports = router;