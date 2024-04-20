const express = require("express");
const router = express.Router();

const vaccineController = require("../../../controllers/Veterinaria/Vaccine/vaccineController");
const Secure = require("../../../middlewares/secure/secure");

router.get("/vaccineList",Secure(['admin','customerService']), vaccineController.getAllVaccines)
router.get("/singleVaccine/:id",Secure(['admin','customerService']), vaccineController.getSingleVaccine)
router.get("/vaccineExcelSheet", vaccineController.vaccineExcelFile)
router.get("/vaccineFilter",Secure(['admin','customerService']), vaccineController.vaccineFilter)
router.post("/createVaccine",Secure(['admin','customerService']), vaccineController.createVaccine);
router.put("/updateVaccine/:id",Secure(['admin','customerService']), vaccineController.updateVaccine);
router.delete("/vaccineRemove/:id",Secure(['admin','customerService']), vaccineController.deleteVaccine);
module.exports = router;