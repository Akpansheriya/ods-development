const express = require("express");
const router = express.Router(); 
const Secure = require("../../../middlewares/secure/secure")
const uploadDoc = require('../../../middlewares/veterinaria/appointment')
const appointmentController = require("../../../controllers/Veterinaria/Appointment/appointmentController")
router.get("/appointmentExcelFile",Secure(['admin']), appointmentController.appointmentExcelFile)
router.get("/appointmentsList",Secure(['admin','customerService','user']), appointmentController.updateAppointmentsStatus)
router.get("/allAppointments",Secure(['customerService','admin']) ,appointmentController.getAllAppointments )
router.get("/singleAppointment/:id",Secure(['customerService','admin','user']) ,appointmentController.getSingleAppointment )
router.get("/dateWiseAppointments",Secure(['customerService','admin']) , appointmentController.dateWiseAppointment)
router.get("/appointmentFilter",Secure(['customerService','admin']) , appointmentController.appointmentFilter)
router.get("/appointmentsOfDoctor/:veterinarianId",Secure(['customerService','admin']) , appointmentController.AppointmentsOfDoctor)
router.post("/scheduleAppointment",Secure(['customerService','admin']) , appointmentController.createAppointment);
router.put("/updateAppointment/:id",Secure(['customerService','admin','user']) , appointmentController.updateAppointment);
router.put("/registerDiagnostic/:id",uploadDoc.array('documentation', 10),Secure(['customerService','admin']) , appointmentController.registerDiagnostic);
router.delete("/appointmentRemove/:id",Secure(['admin','customerService']), appointmentController.deleteAppointmentRecord);
module.exports = router;