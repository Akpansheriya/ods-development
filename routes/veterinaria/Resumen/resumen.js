const express = require("express");
const router = express.Router();

const resumenController = require("../../../controllers/Veterinaria/Resumen/resumen");
const Secure = require("../../../middlewares/secure/secure");
router.get("/dashboardSummary", resumenController.dashboardSummaryData)
router.get("/dashboardSummaryExcel",Secure(['masterAdmin','customerService']), resumenController.dashboardSummaryExcel)
router.get("/ownerGraph",Secure(['masterAdmin','customerService']), resumenController.ownerGraph)
 router.get("/pendingAppointments",Secure(['masterAdmin','customerService']), resumenController.pendingAppointments)
router.get("/appointmentGraph",Secure(['masterAdmin','customerService']), resumenController.appointmentGraph)
router.get("/paymentGraph",Secure(['masterAdmin','customerService']), resumenController.paymentGraph)


//-------------------- vets----------------------//


router.get("/vets/monthlyMetrics/:veterinarianId",Secure(['user']),  resumenController.monthlyMetrics)
router.get("/vets/appointmentsByDate/:veterinarianId",Secure(['user']),  resumenController.appointmentsByDate)
router.get("/vets/ownersAgeGraph/:veterinarianId",Secure(['user']),  resumenController.ownersAgeGraph)
router.get("/vets/appointmentGraph/:veterinarianId",Secure(['user']),  resumenController.appointmentGraphVets)
module.exports = router;