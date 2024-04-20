const express = require("express");
const router = express.Router();

const petController = require("../../../controllers/Veterinaria/Pet/petController");
const Secure = require("../../../middlewares/secure/secure");
router.get("/petExcelSheet",Secure(['admin']), petController.petExcelFile)
router.get("/petSummaryPdf/:id",Secure(['admin']), petController.petSummaryPdf)
router.get("/petAppointment/:id",Secure(['admin','customerService','user']), petController.appointmentDataOfPet)
router.get("/petsList",Secure(['admin','customerService','user']), petController.getAllPets)
router.get("/singlePet/:id",Secure(['admin','customerService','user']), petController.getSinglePet)
router.get("/petFilter",Secure(['admin','customerService','user']), petController.petFilter)
router.post("/createPet",Secure(['admin','customerService']), petController.createPet);
router.put("/petUpdate/:id",Secure(['admin','customerService']), petController.updatePet);
router.delete("/petRemove/:id",Secure(['admin','customerService']), petController.deletePetRecord);
module.exports = router;