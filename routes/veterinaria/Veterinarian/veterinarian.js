const express = require("express");
const router = express.Router();
const uploadAvatar = require("../../../middlewares/veterinaria/veterinarian");
const specialityController = require("../../../controllers/Veterinaria/Veterinarian/specialityController");
const veterinarianController = require("../../../controllers/Veterinaria/Veterinarian/veterinarian");
const Secure = require("../../../middlewares/secure/secure");

// speciality
router.get("/specialityList",Secure(['admin']), specialityController.getAllSpecialities);
router.get("/veterinarianBySpeciality",Secure(['admin']), specialityController.getVeterinariansBySpeciality);
router.get("/singleSpeciality/:id",Secure(['admin']), specialityController.getSingleSpeciality);
router.post("/createSpeciality",Secure(['admin']), specialityController.createSpeciality);
router.put("/UpdateSpeciality/:id",Secure(['admin']), specialityController.updateSpeciality);
router.delete("/specialityRemove/:id",Secure(['admin']), specialityController.deleteSpeciality);





// veterinarian
router.get("/veterinariansList",Secure(['customerService','admin','user']) ,  veterinarianController.getAllVeterinarians);
router.get(
  "/veterinariansAppointmentList",Secure(['admin','customerService']),
  veterinarianController.appointmentData
);
router.get(
  "/singleVeterinarianAppointment/:id",Secure(['admin','customerService','user']),
  veterinarianController.appointmentDataBySingleVeterinarian
);
router.get(
  "/singleVeterinarian/:id",Secure(['admin','customerService','user' ]),
  veterinarianController.getSingleVeterinarians
);
router.get(
  "/veterinariansExcelSheet/:veterinarianId",
  veterinarianController.veterinarianExcelFile
);
router.get("/veterinariansFilter",Secure(['admin']), veterinarianController.veterinarianFilter);
router.post(
  "/createVeterinarian",Secure(['admin']),
  uploadAvatar.single("avatar"),
  veterinarianController.createVeterinarian
);
router.put(
  "/UpdateVeterinarian/:id",Secure(['admin']), uploadAvatar.single("avatar"),
  veterinarianController.updateVeterinarian
);
router.delete(
  "/veterinarianRemove/:id",Secure(['admin']),
  veterinarianController.deleteVeterinarian
);



// vets

router.get("/vets/ownersByVeterinarian/:veterinarianId",Secure(['user']), veterinarianController.ownersByVeterinarian);
router.get("/vets/petsByVeterinarian/:veterinarianId",Secure(['user']), veterinarianController.petsByVeterinarian);

module.exports = router;
