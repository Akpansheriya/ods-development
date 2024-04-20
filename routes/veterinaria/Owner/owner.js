const express = require("express");
const router = express.Router();
const Secure = require("../../../middlewares/secure/secure")
const ownerController = require("../../../controllers/Veterinaria/Owner/ownerController")
router.get("/ownerExcelFile", ownerController.ownerExcelFile)
router.get("/petAppointmentsOfOwner/:id",Secure(['customerService','admin','user']) ,  ownerController.petAppointmentDataOfOwner)
router.get("/ownersList",Secure(['customerService','admin','user']) , ownerController.getAllOwners)
router.get("/singleOwner/:id",Secure(['admin','customerService',' ']), ownerController.getSingleOwner)
router.get("/petListByOwner/:id",Secure(['admin','customerService','user']), ownerController.getAllPetsByOwner)
router.get("/ownerFilter",Secure(['admin','customerService']), ownerController.ownerFilter)
router.post("/createOwner",Secure(['admin','customerService']), ownerController.createOwner);
router.put("/updateOwner/:id",Secure(['admin','customerService']), ownerController.updateOwner);
router.delete("/ownerRemove/:id",Secure(['admin','customerService']), ownerController.deleteOwnerRecord);
module.exports = router;