const express = require("express");
const router = express.Router();
const upload = require('../../../middlewares/veterinaria/multer')
const usersController = require("../../../controllers/Veterinaria/Admin/usersController");
const Secure = require("../../../middlewares/secure/secure");

router.post("/adminRegistration",upload.single('profile'),Secure(['admin']), usersController.adminRegister);
router.post("/customerServiceRegistration",upload.single('profile'),Secure(['admin']), usersController.customerServiceRegister);
router.post("/MasterAdminRegistration",upload.single('profile'), usersController.MasterAdminRegistration);
router.post("/userLogins",usersController.userLogin );
router.post("/verificationLink",usersController.sendForgetPasswordLink );
router.put("/updatePassword",usersController.updatePassword );
router.post("/sendUserPassword/:id",Secure(['admin']), usersController.sendPassword)
router.put("/updateProfile/:id",upload.single('profile'),Secure(['customerService','admin']), usersController.updateUserProfile)
router.post("/changePassword/:id", usersController.changeUserPassword)
router.delete("/deleteUserProfile/:id",Secure(['admin']), usersController.deleteUserProfile)
router.get("/userList",Secure(['customerService','admin']) ,usersController.getAllUsersData)
router.get("/userFilter",Secure(['customerService','admin']), usersController.userFilter)
router.get("/loginUserDetail/:id", usersController.getLoginUserDetail)
module.exports = router;