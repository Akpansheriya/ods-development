const Database = require("../../../config/connection");
const Auth = Database.user;
const Veterinarian = Database.veterinarian;
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const fs = require("fs");
const { Op} = require("sequelize");


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: "ankitpansheriya123@gmail.com",
    pass: "kfrexsoxsevhnkdn",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const adminRegister = async (req, res) => {
  const email = req.body.email;
  
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  console.log("decoded",decoded)
  const user = await Auth.findOne({ where: { email: email } });
 
 
  if (user) {
    return res.status(409).json({
      message: "Mail exists",
    });
  } else {
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      unique:decoded.unique,
      identification: req.body.identification,
      phone: req.body.phone,
      role: "admin",
      profile: req.file
        ? req.protocol +
          "://" +
          req.get("host") +
          `/profile/profile/${req.file.filename}`
        : "",
      isverified: false,
      isAdmin: req.body.role === "admin" ? true : false,
      isMasterAdmin: req.body.role === "masterAdmin" ? true : false,
      isCustomerService: req.body.role === "customerService" ? true : false,
    };
    if (req.body.password === req.body.confirmPassword) {
      if (userData.email === "" || userData.email === null) {
        return res.status(400).send({ message: "email is required" });
      } else if (userData.name === "" || userData.name === null) {
        return res.status(400).send({ message: "name is required" });
      } else if (userData.role === "" || userData.role === null) {
        return res.status(400).send({ message: "role is required" });
      } else if (userData.profile === "" || userData.profile === null) {
        return res.status(400).send({ message: "profile is required" });
      } else if (userData.password === "" || userData.password === null) {
        return res.status(400).send({ message: "password is required" });
      } else if (
        userData.confirmPassword === "" ||
        userData.confirmPassword === null
      ) {
        return res.status(400).send({ message: "confirmPassword is required" });
      } else {
       
        Auth.create(userData).then((result) => {
          console.log(result);
          res.status(201).send({
            message: "user created",
            result: result,
          });
        });
      }
    } else {
      return res
        .status(400)
        .send({ message: "Password and confirm password do not match." });
    }
  }
};
const customerServiceRegister = async (req, res) => {
  const email = req.body.email;
  const user = await Auth.findOne({ where: { email: email } });
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  if (user) {
    return res.status(409).json({
      message: "Mail exists",
    });
  } else {
    const userData = {
      name: req.body.name,
      email: req.body.email,
      unique:decoded.unique,
      password: req.body.password,
      identification: req.body.identification,
      phone: req.body.phone,
      role: "customerService",
      profile: req.file
        ? req.protocol +
          "://" +
          req.get("host") +
          `/profile/profile/${req.file.filename}`
        : "",
      isverified: false,
      isAdmin: req.body.role === "admin" ? true : false,
      isMasterAdmin: req.body.role === "masterAdmin" ? true : false,
      isCustomerService: req.body.role === "customerService" ? true : false,
    };
    if (req.body.password === req.body.confirmPassword) {
      if (userData.email === "" || userData.email === null) {
        return res.status(400).send({ message: "email is required" });
      } else if (userData.name === "" || userData.name === null) {
        return res.status(400).send({ message: "name is required" });
      } else if (userData.role === "" || userData.role === null) {
        return res.status(400).send({ message: "role is required" });
      } else if (userData.profile === "" || userData.profile === null) {
        return res.status(400).send({ message: "profile is required" });
      } else if (userData.password === "" || userData.password === null) {
        return res.status(400).send({ message: "password is required" });
      } else if (
        userData.confirmPassword === "" ||
        userData.confirmPassword === null
      ) {
        return res.status(400).send({ message: "confirmPassword is required" });
      } else {
        Auth.create(userData).then((result) => {
          console.log(result);
          res.status(201).send({
            message: "user created",
            result: result,
          });
        });
      }
    } else {
      return res
        .status(400)
        .send({ message: "Password and confirm password do not match." });
    }
  }
};
const MasterAdminRegistration = async (req, res) => {
  try {
    const email = req.body.email;
  

    const user = await Auth.findOne({ where: { email: email } })
    
   
    if (user) {
      return res.status(409).json({
        message: "Mail exists",
      });
    } else {
      const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        identification: req.body.identification,
        phone: req.body.phone,
        role: "masterAdmin",
        profile: req.file
          ? req.protocol +
            "://" +
            req.get("host") +
            `/profile/profile/${req.file.filename}`
          : "",
        isverified: false,
        isAdmin: req.body.role === "admin",
        isMasterAdmin: req.body.role === "masterAdmin",
        isCustomerService: req.body.role === "customerService",
      };

      if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).send({ message: "Password and confirm password do not match." });
      }

      if (!userData.email) {
        return res.status(400).send({ message: "Email is required" });
      }
      if (!userData.name) {
        return res.status(400).send({ message: "Name is required" });
      }
      if (!userData.role) {
        return res.status(400).send({ message: "Role is required" });
      }
      if (!userData.profile) {
        return res.status(400).send({ message: "Profile is required" });
      }
      if (!userData.password) {
        return res.status(400).send({ message: "Password is required" });
      }

      var mailOption = {
        from: "ODS",
        to: userData.email,
        subject: "ODS - Login Password",
        html: `
          <html>
          <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <title>wallpaper</title>
          </head>
          
          <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"
          style="margin: 0pt auto; padding: 0px; background:#E3EEFE;">
          <table id="main" width="100%" height="100%" cellpadding="0" cellspacing="0" border="0"
          bgcolor="#E3EEFE">
          <tbody>
          <tr>
          <td valign="top">
            <table class="innermain" cellpadding="0" width="580" cellspacing="0" border="0"
            bgcolor="#E3EEFE" align="center" style="margin:0 auto; table-layout: fixed;">
              <tbody>
                <tr>
                  <td colspan="4">
                    <table class="logo" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tbody>
                        <tr>
                          <td colspan="2" height="30"></td>
                        </tr>
                        <tr>
                          <td valign="top" align="center">
                           
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" height="30"></td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <!-- Main CONTENT -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"
                    style="border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                      <tbody>
                        <tr>
                          <td height="40"></td>
                        </tr>
                        <tr style="font-family: -apple-system,BlinkMacSystemFont,&#39;Segoe UI&#39;,&#39;Roboto&#39;,&#39;Oxygen&#39;,&#39;Ubuntu&#39;,&#39;Cantarell&#39;,&#39;Fira Sans&#39;,&#39;Droid Sans&#39;,&#39;Helvetica Neue&#39;,sans-serif; color:#4E5C6E; font-size:14px; line-height:20px; margin-top:20px;">
                          <td class="content" colspan="2" valign="top" align="center" style="padding-left:90px; padding-right:90px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
                              <tbody>
                                <tr>
                                  <td align="center" valign="bottom" colspan="2" cellpadding="3">
                                    <img alt="lastbit" width="200" src="https://i.imgur.com/LXjRs5h.gif"
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td height="30" &nbsp;=""></td>
                                </tr>
                                <tr>
                                  <td align="center"> <span style="color:#00204A;font-size:22px;line-height: 24px;">
          Hey ${userData.name}
          </span>
          
                                  </td>
                                </tr>
                                <tr>
                                  <td height="24" &nbsp;=""></td>
                                </tr>
                                <tr>
                                  <td height="1" bgcolor="#DAE1E9"></td>
                                </tr>
                                <tr>
                                  <td height="24" &nbsp;=""></td>
                                </tr>
                              
                                <tr>
                                  <td height="20" &nbsp;=""></td>
                                </tr>
                                <tr> 
                               <h2> email : ${userData.email} </h2>
                               </tr>
                               <tr> 
                               <h2> password : ${userData.password} </h2>
                               </tr>
                                <tr>
                                  <td height="20" &nbsp;=""></td>
                                </tr>
                                <tr>
                                  <td align="center">
                                    <img src="https://i.imgur.com/FjvPESc.png" width="54"
                                    height="2" border="0">
                                  </td>
                                </tr>
                               
                                
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td height="60"></td>
                        </tr>
                      </tbody>
                    </table>
                 
                    <table id="promo" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
                      <tbody>
                        <tr>
                          <td colspan="2" height="20"></td>
                        </tr>
                       
                        <tr>
                          <td colspan="2" height="20"></td>
                        </tr>
                        
                        <tr>
                          <td colspan="2" height="20"></td>
                        </tr>
                      </tbody>
                    </table>
                 
                   
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tbody>
                        <tr>
                          <td height="10">&nbsp;</td>
                        </tr>
                        <tr>
                         
                        </tr>
                        <tr>
                          <td height="50">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                    
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
          </tr>
          </tbody>
          </table>
          </body>
          
          </html>
              `,
      };

      transporter.sendMail(mailOption, function (error, info) {
        if (error) {
          console.log(error);
          res.status(404).json({
            message: "Invalid email",
          });
        } else {
          Auth.create(userData).then((result) => {
            console.log(result);
            res.status(201).send({
              message: "MasterAdmin created, check email",
              result: result,
            });
          });
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
const userLogin = async (req, res) => {
  try {
    const user = await Auth.findOne({ where: { email: req.body.email } });

    const veterinarian = await Veterinarian.findOne({
      where: { email: req.body.email },
    });
    if (user) {
      const passwordMatch = user.password === req.body.password;

      if (!passwordMatch) {
        return res.status(400).json({ message: "Wrong password" });
      }

      const token = jwt.sign(
        {
          email: user.email,
          userId: user.id,
          role: user.role,
          unique:user.unique ? user.unique : ""
        },
        "hello$%#@!ADMIN___++",
        {
          expiresIn: "24h",
        }
      );

      return res.status(200).json({
        message: `${user.role} login successfully`,
        token: token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          unique:user.unique ? user.unique : ""
        },
      });
    } else if (veterinarian) {
      const passwordMatch = veterinarian.password === req.body.password;

      if (!passwordMatch) {
        return res.status(400).json({ message: "Wrong password" });
      }

      const token = jwt.sign(
        {
          email: veterinarian.email,
          userId: veterinarian.id,
          unique:veterinarian.unique ? veterinarian.unique : "",
          role: "user",
        },
        "hello$%#@!ADMIN___++",
        {
          expiresIn: "24h",
        }
      );

      return res.status(200).json({
        message: "veterinarian login successfully",
        token: token,
        user: {
          id: veterinarian.id,
          name: veterinarian.name,
          unique:veterinarian.unique ? veterinarian.unique : "",
          role: "user",
        },
      });
    } else {
      res.status(400).send({
        message: "user not found",
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const sendPassword = async (req, res) => {
  const id = req.params.id;
  const user = await Auth.findOne({ where: { id: id } });
  var mailoption = {
    from: "ODS",
    to: user?.dataValues?.email,
    subject: "ODS - Login Password",
    html: `
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>wallpaper</title>
</head>

<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"
style="margin: 0pt auto; padding: 0px; background:#E3EEFE;">
<table id="main" width="100%" height="100%" cellpadding="0" cellspacing="0" border="0"
bgcolor="#E3EEFE">
<tbody>
<tr>
<td valign="top">
  <table class="innermain" cellpadding="0" width="580" cellspacing="0" border="0"
  bgcolor="#E3EEFE" align="center" style="margin:0 auto; table-layout: fixed;">
    <tbody>
      <tr>
        <td colspan="4">
          <table class="logo" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tbody>
              <tr>
                <td colspan="2" height="30"></td>
              </tr>
              <tr>
                <td valign="top" align="center">
                 
                </td>
              </tr>
              <tr>
                <td colspan="2" height="30"></td>
              </tr>
            </tbody>
          </table>
          
          <!-- Main CONTENT -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"
          style="border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <tbody>
              <tr>
                <td height="40"></td>
              </tr>
              <tr style="font-family: -apple-system,BlinkMacSystemFont,&#39;Segoe UI&#39;,&#39;Roboto&#39;,&#39;Oxygen&#39;,&#39;Ubuntu&#39;,&#39;Cantarell&#39;,&#39;Fira Sans&#39;,&#39;Droid Sans&#39;,&#39;Helvetica Neue&#39;,sans-serif; color:#4E5C6E; font-size:14px; line-height:20px; margin-top:20px;">
                <td class="content" colspan="2" valign="top" align="center" style="padding-left:90px; padding-right:90px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
                    <tbody>
                      <tr>
                        <td align="center" valign="bottom" colspan="2" cellpadding="3">
                          <img alt="lastbit" width="200" src="https://i.imgur.com/LXjRs5h.gif"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td height="30" &nbsp;=""></td>
                      </tr>
                      <tr>
                        <td align="center"> <span style="color:#00204A;font-size:22px;line-height: 24px;">
Hey ${user?.dataValues?.name}
</span>

                        </td>
                      </tr>
                      <tr>
                        <td height="24" &nbsp;=""></td>
                      </tr>
                      <tr>
                        <td height="1" bgcolor="#DAE1E9"></td>
                      </tr>
                      <tr>
                        <td height="24" &nbsp;=""></td>
                      </tr>
                    
                      <tr>
                        <td height="20" &nbsp;=""></td>
                      </tr>
                     <tr> 
                     <h2> password : ${user?.dataValues?.password} </h2>
                     </tr>
                      <tr>
                        <td height="20" &nbsp;=""></td>
                      </tr>
                      <tr>
                        <td align="center">
                          <img src="https://i.imgur.com/FjvPESc.png" width="54"
                          height="2" border="0">
                        </td>
                      </tr>
                     
                      
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td height="60"></td>
              </tr>
            </tbody>
          </table>
       
          <table id="promo" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
            <tbody>
              <tr>
                <td colspan="2" height="20"></td>
              </tr>
             
              <tr>
                <td colspan="2" height="20"></td>
              </tr>
              
              <tr>
                <td colspan="2" height="20"></td>
              </tr>
            </tbody>
          </table>
       
         
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tbody>
              <tr>
                <td height="10">&nbsp;</td>
              </tr>
              <tr>
               
              </tr>
              <tr>
                <td height="50">&nbsp;</td>
              </tr>
            </tbody>
          </table>
          
        </td>
      </tr>
    </tbody>
  </table>
</td>
</tr>
</tbody>
</table>
</body>

</html>
    `,
  };
  transporter.sendMail(mailoption, function (error, info) {
    if (error) {
      console.log(error);
      res.status(404).json({
        message: "invalid email",
      });
    } else {
      res.status(200).send({
        message: "password send successfully",
      });
    }
  });
};

const getLoginUserDetail = async (req, res) => {
  const id = req.params.id;
  const user = await Auth.findOne({ where: { id: id } });
  res.status(200).send({
    message: "login user detail",
    user,
  });
};

const getAllUsersData = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique
    const userList = await Auth.findAll({ where:{unique:unique},
      attributes: ["id", "name", "email", "role", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send({
      message: "userList",
      userList,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUserProfile = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    confirmPassword,
    identification,
    phone,
  } = req.body;

  const id = req.params.id;
  const user = await Auth.findOne({ where: { id: id } });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .send({ message: "Password and confirm password do not match" });
  }

  let profile = user.profile;
  if (req.file) {
    const profileImageUrl =
      req.protocol +
      "://" +
      req.get("host") +
      `/profile/profile/${req.file.filename}`;
    profile = profileImageUrl;
  }

  try {
    if (email === "" || email === null) {
      return res.status(400).send({ message: "email is required" });
    } else if (name === "" || name === null) {
      return res.status(400).send({ message: "name is required" });
    } else if (role === "" || role === null) {
      return res.status(400).send({ message: "role is required" });
    } else if (profile === "" || profile === null) {
      return res.status(400).send({ message: "profile is required" });
    } else if (password === "" || password === null) {
      return res.status(400).send({ message: "password is required" });
    } else if (
      confirmPassword === "" ||
      confirmPassword === null
    ) {
      return res.status(400).send({ message: "confirmPassword is required" });
    } else {
      await Auth.update(
        { name, email, password, role, profile, phone, identification },
        { where: { id: id } }
      );
      if (req.file && user.profile) {
        const existingFilename = user.profile.split("/").pop();
        const imagePath = `./public/profile/${existingFilename}`;
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting old profile image:", err);
          }
        });
      }
      return res.status(200).send({ message: "Profile updated successfully" });
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const changeUserPassword = async (req, res) => {
  const id = req.params.id;
  const { password, currentPassword, confirmPassword } = req.body;
  const user = await Auth.findOne({ where: { id: id } });
  if (
    user?.id === id &&
    user?.password === currentPassword &&
    confirmPassword === password
  ) {
    await Auth.update({ password }, { where: { id: id } });
    res.status(200).send({
      message: "password changed successfully",
    });
  } else {
    res.status(400).send({
      message: "provided details not matching",
    });
  }
};

const deleteUserProfile = async (req, res) => {
  const id = req.params.id;
  const email = req.body.email;
  const pass = req.body.pass;
  const password = await Auth.findOne({
    where: { email: email, password: pass },
  });
  const user = await Auth.findOne({ where: { id: id } });
  const existingFilename = user?.profile?.split("/").pop();
  const imagePath = `./public/profile/${existingFilename}`;

  if (!password) {
    return res.status(400).send({
      message: "Password does not match",
      success: false,
    });
  }
  if (!user) {
    return res.status(404).send({
      message: "Record not found",
      success: false,
    });
  }
  if (password.role !== "masterAdmin") {
    return res.status(400).send({
      message: "Not authorized",
      success: false,
    });
  }
  if (existingFilename && fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(400).send({
          message: "Failed to delete file",
          success: false,
        });
      }
    });
  }

  if (user && pass === password.password) {
    Auth.destroy({ where: { id: id } });
    return res.status(200).send({
      message: "User profile deleted successfully",
      success: true,
    });
  }
};

const userFilter = async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const role = req.query.role;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique
    console.log("startDate", startDate, "endDate", endDate);
    if (req.query.startDate && req.query.endDate && req.query.role) {
      const filteredRecords = await Auth.findAll({
        where: {
          unique,
          role,
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      res.status(200).json({
        message: "Filtered records",
        userList: filteredRecords,
      });
    } else if (req.query.startDate && req.query.endDate && !req.query.role) {
      const filteredRecords = await Auth.findAll({
        where: {
          unique,
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      res.status(200).json({
        message: "Filtered records",
        userList: filteredRecords,
      });
    } else if (req.query.role && !req.query.startDate && !req.query.endDate) {
      const filteredRecords = await Auth.findAll({
        where: {
          unique,
          role,
        },
      });

      res.status(200).json({
        message: "Filtered records",
        userList: filteredRecords,
      });
    } else if (!req.query.role && !req.query.startDate && !req.query.endDate) {
      const userList = await Auth.findAll({where:{unique}, order: [["createdAt", "DESC"]] });
      res.status(200).send({
        message: "userList",
        userList,
      });
    }
  } catch (error) {
    console.error("Error filtering records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendForgetPasswordLink = async (req, res) => {
  const email = req.body.email;
  const user = await Auth.findOne({ where: { email: email } });
  const veterinarian = await Veterinarian.findOne({ where: { email: email } });
  console.log(user?.emailToken, "====================OldToken");
  if (user) {
    var mailoption = {
      from: "ankitpansheriya123@gmail.com",
      to: user.email,
      subject: "ods - verify your email",
      html: `
       
        
        
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>ODS</title>
</head>

<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"
style="margin: 0pt auto; padding: 0px; background:#E3EEFE;">
<table id="main" width="100%" height="100%" cellpadding="0" cellspacing="0" border="0"
bgcolor="#E3EEFE">
<tbody>
<tr>
  <td valign="top">
    <table class="innermain" cellpadding="0" width="580" cellspacing="0" border="0"
    bgcolor="#E3EEFE" align="center" style="margin:0 auto; table-layout: fixed;">
      <tbody>
        <tr>
          <td colspan="4">
            <table class="logo" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tbody>
                <tr>
                  <td colspan="2" height="30"></td>
                </tr>
                <tr>
                  <td valign="top" align="center">
                   
                  </td>
                </tr>
                <tr>
                  <td colspan="2" height="30"></td>
                </tr>
              </tbody>
            </table>
            
            <!-- Main CONTENT -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"
            style="border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <tbody>
                <tr>
                  <td height="40"></td>
                </tr>
                <tr style="font-family: -apple-system,BlinkMacSystemFont,&#39;Segoe UI&#39;,&#39;Roboto&#39;,&#39;Oxygen&#39;,&#39;Ubuntu&#39;,&#39;Cantarell&#39;,&#39;Fira Sans&#39;,&#39;Droid Sans&#39;,&#39;Helvetica Neue&#39;,sans-serif; color:#4E5C6E; font-size:14px; line-height:20px; margin-top:20px;">
                  <td class="content" colspan="2" valign="top" align="center" style="padding-left:90px; padding-right:90px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
                      <tbody>
                        <tr>
                          <td align="center" valign="bottom" colspan="2" cellpadding="3">
                            <img alt="lastbit" width="200" src="https://i.imgur.com/LXjRs5h.gif"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td height="30" &nbsp;=""></td>
                        </tr>
                        <tr>
                          <td align="center"> <span style="color:#00204A;font-size:22px;line-height: 24px;">
 Hey ${user.name}
</span>

                          </td>
                        </tr>
                        <tr>
                          <td height="24" &nbsp;=""></td>
                        </tr>
                        <tr>
                          <td height="1" bgcolor="#DAE1E9"></td>
                        </tr>
                        <tr>
                          <td height="24" &nbsp;=""></td>
                        </tr>
                        <tr>
                          <td align="center"> <span style="color:#00204A;font-size:14px;line-height:24px;">
 please verify your email to continue...
</span><p style="color:#00204A;font-size:14px;line-height:24px;">
  If you did not make this request, just ignore this email. Otherwise, please click the button below to verify your email:
</p>

                          </td>
                        </tr>
                        <tr>
                          <td height="20" &nbsp;=""></td>
                        </tr>
                        <tr>
                          <td align="top" width="50%" align="center"> <span>
  <a href="http://localhost:3000/updatepassword?token=${user.emailToken}" style="display:block; padding:15px 25px; background-color:#448EF6; color:#ffffff; border-radius:7px; text-decoration:none;">Verify Email</a>
</span>

                          </td>
                        </tr>
                        <tr>
                          <td height="20" &nbsp;=""></td>
                        </tr>
                        <tr>
                          <td align="center">
                            <img src="https://i.imgur.com/FjvPESc.png" width="54"
                            height="2" border="0">
                          </td>
                        </tr>
                       
                        
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td height="60"></td>
                </tr>
              </tbody>
            </table>
         
            <table id="promo" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
              <tbody>
                <tr>
                  <td colspan="2" height="20"></td>
                </tr>
               
                <tr>
                  <td colspan="2" height="20"></td>
                </tr>
                
                <tr>
                  <td colspan="2" height="20"></td>
                </tr>
              </tbody>
            </table>
         
           
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tbody>
                <tr>
                  <td height="10">&nbsp;</td>
                </tr>
                <tr>
                 
                </tr>
                <tr>
                  <td height="50">&nbsp;</td>
                </tr>
              </tbody>
            </table>
            
          </td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>
</tbody>
</table>
</body>

</html>
      `,
    };
    transporter.sendMail(mailoption, async function (error, info) {
      if (error) {
        console.log(error);
        res.status(404).json({
          message: "invalid email",
        });
      } else {
        console.log("verification email sent successfully ", info.response);
        res.status(200).send({
          message: "verification link sent successfully",
        });
      }
    });
  } else if (veterinarian) {
    var mailoptions = {
      from: "ods Management",
      to: veterinarian.email,
      subject: "ods - verify your email",
      html: `
       
        
        
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>ODS</title>
</head>

<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"
style="margin: 0pt auto; padding: 0px; background:#E3EEFE;">
<table id="main" width="100%" height="100%" cellpadding="0" cellspacing="0" border="0"
bgcolor="#E3EEFE">
<tbody>
<tr>
  <td valign="top">
    <table class="innermain" cellpadding="0" width="580" cellspacing="0" border="0"
    bgcolor="#E3EEFE" align="center" style="margin:0 auto; table-layout: fixed;">
      <tbody>
        <tr>
          <td colspan="4">
            <table class="logo" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tbody>
                <tr>
                  <td colspan="2" height="30"></td>
                </tr>
                <tr>
                  <td valign="top" align="center">
                   
                  </td>
                </tr>
                <tr>
                  <td colspan="2" height="30"></td>
                </tr>
              </tbody>
            </table>
            
            <!-- Main CONTENT -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"
            style="border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <tbody>
                <tr>
                  <td height="40"></td>
                </tr>
                <tr style="font-family: -apple-system,BlinkMacSystemFont,&#39;Segoe UI&#39;,&#39;Roboto&#39;,&#39;Oxygen&#39;,&#39;Ubuntu&#39;,&#39;Cantarell&#39;,&#39;Fira Sans&#39;,&#39;Droid Sans&#39;,&#39;Helvetica Neue&#39;,sans-serif; color:#4E5C6E; font-size:14px; line-height:20px; margin-top:20px;">
                  <td class="content" colspan="2" valign="top" align="center" style="padding-left:90px; padding-right:90px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
                      <tbody>
                        <tr>
                          <td align="center" valign="bottom" colspan="2" cellpadding="3">
                            <img alt="lastbit" width="200" src="https://i.imgur.com/LXjRs5h.gif"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td height="30" &nbsp;=""></td>
                        </tr>
                        <tr>
                          <td align="center"> <span style="color:#00204A;font-size:22px;line-height: 24px;">
 Hey ${veterinarian.name}
</span>

                          </td>
                        </tr>
                        <tr>
                          <td height="24" &nbsp;=""></td>
                        </tr>
                        <tr>
                          <td height="1" bgcolor="#DAE1E9"></td>
                        </tr>
                        <tr>
                          <td height="24" &nbsp;=""></td>
                        </tr>
                        <tr>
                          <td align="center"> <span style="color:#00204A;font-size:14px;line-height:24px;">
 please verify your email to continue...
</span><p style="color:#00204A;font-size:14px;line-height:24px;">
  If you did not make this request, just ignore this email. Otherwise, please click the button below to verify your email:
</p>

                          </td>
                        </tr>
                        <tr>
                          <td height="20" &nbsp;=""></td>
                        </tr>
                        <tr>
                          <td align="top" width="50%" align="center"> <span>
  <a href="href="http://localhost:3000/updatepassword?token=${veterinarian.emailToken}" style="display:block; padding:15px 25px; background-color:#448EF6; color:#ffffff; border-radius:7px; text-decoration:none;">Verify Email</a>
</span>

                          </td>
                        </tr>
                        <tr>
                          <td height="20" &nbsp;=""></td>
                        </tr>
                        <tr>
                          <td align="center">
                            <img src="https://i.imgur.com/FjvPESc.png" width="54"
                            height="2" border="0">
                          </td>
                        </tr>
                       
                        
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td height="60"></td>
                </tr>
              </tbody>
            </table>
         
            <table id="promo" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
              <tbody>
                <tr>
                  <td colspan="2" height="20"></td>
                </tr>
               
                <tr>
                  <td colspan="2" height="20"></td>
                </tr>
                
                <tr>
                  <td colspan="2" height="20"></td>
                </tr>
              </tbody>
            </table>
         
           
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tbody>
                <tr>
                  <td height="10">&nbsp;</td>
                </tr>
                <tr>
                 
                </tr>
                <tr>
                  <td height="50">&nbsp;</td>
                </tr>
              </tbody>
            </table>
            
          </td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>
</tbody>
</table>
</body>

</html>
      `,
    };
    transporter.sendMail(mailoptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(404).json({
          message: "invalid email",
        });
      } else {
        console.log("verification email sent successfully ", info.response);
        res.status(200).send({
          message: "verification link sent successfully",
        });
      }
    });
  } else {
    res.status(400).send({
      message: "user not found",
    });
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const token = req.body.token;
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const user = await Auth.findOne({ email: decoded?.email });
    console.log(decoded?.email);
    const veterinarian = await Veterinarian.findOne({ email: decoded?.email });
    if (password === "" && confirmPassword === "") {
      return res
        .status(400)
        .send({ message: "password and confirm password is required" });
    }

    if (user?.email !== null) {
      if (password === confirmPassword) {
        await Auth.update(
          {
            emailToken: null,
            password: password,
          },
          {
            where: { email: user?.email },
          }
        );
        res.status(200).send({
          message: "Password updated successfully",
        });
      } else {
        res.status(400).send({
          message: "Password and confirm password do not match",
        });
      }
    } else if (veterinarian.email !== null) {
      if (password === confirmPassword) {
        await Veterinarian.update(
          {
            emailToken: null,
            password: password,
          },
          {
            where: { email: veterinarian.email },
          }
        );
        res.status(200).send({
          message: "Password updated successfully",
        });
      } else {
        res.status(400).send({
          message: "Password and confirm password do not match",
        });
      }
    } else {
      res.status(400).send({
        message: "User not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "An error occurred while updating the password",
    });
  }
};

module.exports = {
  adminRegister,
  customerServiceRegister,
  MasterAdminRegistration,
  userLogin,
  sendPassword,
  getAllUsersData,
  getLoginUserDetail,
  updateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  userFilter,
  sendForgetPasswordLink,
  updatePassword,
};
