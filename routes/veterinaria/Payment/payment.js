const express = require("express");
const router = express.Router();

const paymentController = require("../../../controllers/Veterinaria/Payment/paymentController");
const Secure = require("../../../middlewares/secure/secure");
router.get("/paymentExcelSheet",Secure(['admin']), paymentController.paymentExcelFile)
router.get("/paymentsList",Secure(['admin','customerService']), paymentController.getAllPayments)
router.get("/singlePayment/:id",Secure(['admin','customerService']), paymentController.getSinglePayment)
router.get("/paymentFilter",Secure(['admin','customerService']), paymentController.paymentFilter)
router.post("/paymentRegistration",Secure(['admin','customerService']), paymentController.registerPayment);
router.put("/paymentUpdate/:id",Secure(['admin','customerService']), paymentController.updatePayment);
router.delete("/paymentRemove/:id",Secure(['admin','customerService']), paymentController.deletePaymentRecord);
module.exports = router;