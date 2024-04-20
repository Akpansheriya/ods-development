const { Op } = require("sequelize");
const Database = require("../../../config/connection");
const Veterinarian = Database.veterinarian;
const Appointment = Database.appointment;
const Owner = Database.owner;
const Pet = Database.pet;
const ExcelJS = require("exceljs");
const moment = require('moment');
const Admin = Database.user;
const jwt = require("jsonwebtoken");
const fs = require("fs");
const createVeterinarian = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const veterinarian = {
      avatar: req.file
        ? req.protocol +
          "://" +
          req.get("host") +
          `/profile/veterinarian/${req.file.filename}`
        : null,
      name: req.body.name,
      unique:unique,
      surname: req.body.surname,
      speciality:
        req.body.speciality === "" || !req.body.speciality
          ? null
          : req.body.speciality,
      specialityId: req.body.specialityId,
      dob: new Date(req.body.dob),
      phone: req.body.phone,
      email: req.body.email,
      identity: req.body.identity,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      sex: req.body.sex,
      address:
        req.body.address === "" || !req.body.address ? null : req.body.address,
      department: req.body.department,
      district:
        req.body.district === "" || !req.body.district
          ? null
          : req.body.district,
      workingDays: req.body.workingDays,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
    };
    if (veterinarian.name === "" || veterinarian.name === null) {
      res.status(400).send({
        message: "name is required",
      });
    } else if (veterinarian.surname === "" || veterinarian.surname === null) {
      res.status(400).send({
        message: "surname is required",
      });
    } else if (veterinarian.dob === "" || veterinarian.dob === null) {
      res.status(400).send({
        message: "dob is required",
      });
    } else if (veterinarian.phone === "" || veterinarian.phone === null) {
      res.status(400).send({
        message: "phone is required",
      });
    } else if (veterinarian.email === "" || veterinarian.email === null) {
      res.status(400).send({
        message: "email is required",
      });
    } else if (veterinarian.identity === "" || veterinarian.identity === null) {
      res.status(400).send({
        message: "identity is required",
      });
    } else if (veterinarian.password === "" || veterinarian.password === null) {
      res.status(400).send({
        message: "password is required",
      });
    } else if (
      veterinarian.confirmPassword === "" ||
      veterinarian.confirmPassword === null
    ) {
      res.status(400).send({
        message: "confirmPassword is required",
      });
    } else if (veterinarian.sex === "" || veterinarian.sex === null) {
      res.status(400).send({
        message: "sex is required",
      });
    } else if (
      veterinarian.department === "" ||
      veterinarian.department === null
    ) {
      res.status(400).send({
        message: "department is required",
      });
    } else if (
      veterinarian.workingDays === "" ||
      veterinarian.workingDays === null
    ) {
      res.status(400).send({
        message: "workingDays is required",
      });
    } else if (
      veterinarian.start_time === "" ||
      veterinarian.start_time === null
    ) {
      res.status(400).send({
        message: "start_time is required",
      });
    } else if (veterinarian.end_time === "" || veterinarian.end_time === null) {
      res.status(400).send({
        message: "end_time is required",
      });
    } else {
      if (veterinarian.password === veterinarian.confirmPassword) {
        Veterinarian.create(veterinarian).then((result) => {
          res.status(201).send({
            message: "veterinarian created",
            result: result,
          });
        });
      } else {
        res.status(400).send({
          message: "password not match with confirm password",
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      message: "Error veterinarian creation",
      error: error.message,
    });
  }
};

const updateVeterinarian = async (req, res) => {
  try {
    const id = req.params.id;
    const veterinarianExist = await Veterinarian.findOne({ where: { id: id } });
    const existingFilename = veterinarianExist?.avatar ?  veterinarianExist?.avatar?.split("/").pop() : "";

    const imagePath = `./public/veterinarian/${existingFilename}`;
    const veterinarian = {
      avatar:req.file ?
        req.protocol +
        "://" +
        req.get("host") +
        `/profile/veterinarian/${req.file.filename}` : req.body.avatar,
      name: req.body.name,
      surname: req.body.surname,
      speciality: req.body.speciality,
      dob: new Date(req.body.dob),
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      sex: req.body.sex,
      address: req.body.address,
      department: req.body.department,
      district: req.body.district,
      workingDays: req.body.workingDays,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
    };

    if (veterinarianExist) {
      await Veterinarian.update(veterinarian, { where: { id: id } });
     
      if (req.file && req.file.filename !== "" && existingFilename !== "") {
        fs.unlink(imagePath, (err) => {
          if (err) {
            res.status(400).send({
              message: "profile not updated",
            });
          } else {
            if (veterinarian.name === "" || veterinarian.name === null) {
              res.status(400).send({
                message: "name is required",
              });
            } else if (veterinarian.surname === "" || veterinarian.surname === null) {
              res.status(400).send({
                message: "surname is required",
              });
            } else if (veterinarian.dob === "" || veterinarian.dob === null) {
              res.status(400).send({
                message: "dob is required",
              });
            } else if (veterinarian.phone === "" || veterinarian.phone === null) {
              res.status(400).send({
                message: "phone is required",
              });
            } else if (veterinarian.email === "" || veterinarian.email === null) {
              res.status(400).send({
                message: "email is required",
              });
            } else if (veterinarian.identity === "" || veterinarian.identity === null) {
              res.status(400).send({
                message: "identity is required",
              });
            } else if (veterinarian.password === "" || veterinarian.password === null) {
              res.status(400).send({
                message: "password is required",
              });
            } else if (
              veterinarian.confirmPassword === "" ||
              veterinarian.confirmPassword === null
            ) {
              res.status(400).send({
                message: "confirmPassword is required",
              });
            } else if (veterinarian.sex === "" || veterinarian.sex === null) {
              res.status(400).send({
                message: "sex is required",
              });
            } else if (
              veterinarian.department === "" ||
              veterinarian.department === null
            ) {
              res.status(400).send({
                message: "department is required",
              });
            } else if (
              veterinarian.workingDays === "" ||
              veterinarian.workingDays === null
            ) {
              res.status(400).send({
                message: "workingDays is required",
              });
            } else if (
              veterinarian.start_time === "" ||
              veterinarian.start_time === null
            ) {
              res.status(400).send({
                message: "start_time is required",
              });
            } else if (veterinarian.end_time === "" || veterinarian.end_time === null) {
              res.status(400).send({
                message: "end_time is required",
              });
            } else {
              if (veterinarian.password === veterinarian.confirmPassword) {
                Veterinarian.create(veterinarian).then((result) => {
                  res.status(201).send({
                    message: "veterinarian created",
                    result: result,
                  });
                });
              }
            }
          }
        });
      } else {
        res.status(200).send({
          message: "profile updated successfully",
        });
      }
    } else {
      res.status(404).send({
        message: "veterinarian not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating veterinarian",
      error: error.message,
    });
  }
};
const deleteVeterinarian = async (req, res) => {
  try {
    const id = req.params.id;
    const veterinarian = await Veterinarian.findOne({ where: { id: id } });
    const { pass, email } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const user = await Admin.findOne({
      where: { email: email },
    });
    if (pass !== user.password) {
      return res.status(400).send({
        message: "password not match",
        success: false,
      });
    }
    if (decoded.role !== user.role) {
      return res.status(400).send({
        message: "Not authorized",
        success: false,
      });
    }

    if (!veterinarian) {
      return res.status(404).send({
        message: "Veterinarian record not found",
        success: false,
      });
    }

    const existingFilename = veterinarian?.avatar !== null ? veterinarian?.avatar.split("/").pop() : "";
    const imagePath = `./public/veterinaria/veterinarian/${existingFilename}`;
    console.log("imagePath", imagePath);
    console.log("existingFilename", existingFilename);

    if (imagePath !== "" || existingFilename !== undefined || existingFilename !== null || existingFilename !== "")  {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath, async (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
      }
    }

    await Veterinarian.destroy({ where: { id: id } });
    await Appointment.destroy({ where: { veterinarianId: id } });

    return res.status(200).send({
      message: "Veterinarian deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting veterinarian:", error);
    return res.status(500).send({
      message: "Internal Server Error",
      success: false,
    });
  }
};


const getAllVeterinarians = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const unique = decoded.unique;
  const veterinarianList = await Veterinarian.findAll({where:{unique}});
  res.status(200).send({
    message: "veterinarianList",
    veterinarianList,
  });
};

const veterinarianFilter = async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const speciality = req.query.speciality ? req.query.speciality : "";
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;

    if (req.query.startDate && req.query.endDate && req.query.speciality) {
      const filteredRecords = await Veterinarian.findAll({
        where: {
          speciality,
          unique,
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      res.status(200).json({
        message: "Filtered records",
        veterinarianList: filteredRecords,
      });
    } else if (
      req.query.startDate &&
      req.query.endDate &&
      !req.query.speciality
    ) {
      const filteredRecords = await Veterinarian.findAll({
        where: {
          unique,
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      res.status(200).json({
        message: "Filtered records",
        veterinarianList: filteredRecords,
      });
    } else if (
      req.query.speciality &&
      !req.query.startDate &&
      !req.query.endDate
    ) {
      const filteredRecords = await Veterinarian.findAll({
        where: {
          unique,
          speciality,
        },
      });

      res.status(200).json({
        message: "Filtered records",
        veterinarianList: filteredRecords,
      });
    } else if (
      !req.query.speciality &&
      !req.query.startDate &&
      !req.query.endDate
    ) {
      const veterinarianList = await Veterinarian.findAll({
        where:{unique},
        order: [["createdAt", "DESC"]],
      });
      res.status(200).send({
        message: "veterinarianList",
        veterinarianList,
      });
    }
  } catch (error) {
    console.error("Error filtering records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const veterinarianExcelFile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const veterinarianId = req.params.veterinarianId;
    const veterinarian = await Appointment.findOne({
      where: { veterinarianId: veterinarianId ,unique}
    });

    if (!veterinarian) {
      return res.status(404).send({ message: "Veterinarian not found" });
    }

    const veterinarianData = {
      COD: veterinarian.id,
      Mascota: veterinarian.pet,
      Horario: `${veterinarian.scheduleStart} - ${veterinarian.scheduleEnd}`,
      Fecha: veterinarian.createdAt,
      Estado: veterinarian.status
    };

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("appointments");

    // Add merged cells for title and image
    worksheet.mergeCells("A1:B2");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "Historical de Doctor";
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "left" };

    worksheet.mergeCells("C1:D2");
    const imageId = workbook.addImage({
      filename: "./public/ods.png",
      extension: "png",
    });
    worksheet.addImage(imageId, {
      tl: { col: 2, row: 0 },
      br: { col: 4, row: 2 },
    });

    // Set border style for blank space
    worksheet.getCell("B1").border = {
      right: { style: "thin", color: { argb: "FFFFFF" } },
    };
    worksheet.getCell("B2").border = {
      right: { style: "thin", color: { argb: "FFFFFF" } },
    };

    // Write headers to the worksheet
    const headers = Object.keys(veterinarianData);
    worksheet.addRow(headers);

    // Write data to the worksheet
    const row = [];
    headers.forEach((header) => {
      row.push(veterinarianData[header]);
    });
    worksheet.addRow(row);

    // Format header row
    worksheet.getRow(4).eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDDDDD" } };
      cell.font = { size: 11, bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 3) {
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
        });
      }
      })
    // Format data rows and set colors based on the status
    const estadoCell = worksheet.getCell("E5"); // Assuming "Estado" is in column E (5th column)
    const estadoValue = estadoCell.value;

    switch (estadoValue) {
      case "complete":
        estadoCell.value = "COMPLETADO";
        estadoCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "00B056" } }; // Green color (RGB 0,176,86)
        estadoCell.font = { color: { argb: "FFFFFF" } }; // White font color
        break;
      case "not complete":
        estadoCell.value = "NO ASISTIÓ";
        estadoCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDDDDD" } }; // Light gray color (RGB 221,221,221)
        estadoCell.font = { color: { argb: "000000" } }; // Black font color
        break;
      case "pending":
        estadoCell.value = "PENDIENTE";
        estadoCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "E1E100" } }; // Yellow color (RGB 225,225,0)
        estadoCell.font = { color: { argb: "000000" } }; // Black font color
        break;
      default:
        // Handle any other status or leave it unchanged
        break;
    }

    // Set row height
    worksheet.eachRow((row) => {
      row.height = 21.75;
    });

    // Set column widths
    worksheet.getColumn(1).width = 15.41;
    worksheet.getColumn(2).width = 20.41;
    worksheet.getColumn(3).width = 15.41;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 28;
    worksheet.getColumn(8).width = 20;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=veterinarian.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting Excel file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const appointmentData = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const vet = req.query.name;
    const veterinarians = await Veterinarian.findAll({
      include: [
        {
          model: Appointment,
          as: "vetsAppointment",
        },
      ],
      where: { name: vet ,unique},
    });

    const data = [];

    veterinarians.forEach((vet) => {
      vet.vetsAppointment.forEach((appointment) => {
        data.push({
          name: vet.name,
          start: new Date(
            `${appointment.date.toISOString().split("T")[0]} ${
              appointment.scheduleStart
            }`
          ),
          end: new Date(
            `${appointment.date.toISOString().split("T")[0]} ${
              appointment.scheduleEnd
            }`
          ),
        });
      });
    });

    res.status(200).send({
      message: "appointmentList",
      veterinarian: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const appointmentDataBySingleVeterinarian = async (req, res) => {
  try {
    const id = req.params.id;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    if (id !== "") {
      const veterinarian = await Veterinarian.findByPk(id, {where:{unique},
        include: [
          {
            model: Appointment,
            as: "vetsAppointment",
          },
        ],
      });

      if (!veterinarian) {
        return res.status(404).send({ message: "Veterinarian not found" });
      }

      const data = [];

      veterinarian.vetsAppointment.forEach((appointment) => {
       const actualDate = new Date(appointment.date);
        const startHour = parseInt(appointment.scheduleStart.split(":")[0]);
        const startMinute  = parseInt(appointment.scheduleStart.split(":")[1]);
        const startDate = moment(actualDate)
        .hours(startHour)
        .minutes(startMinute);
      
console.log("startDate",startDate)
const actualendDate = new Date(appointment.date);
const endHour = parseInt(appointment.scheduleEnd.split(":")[0]);
console.log("endHour",endHour)

const endMinute = parseInt(appointment.scheduleEnd.split(":")[1]);
console.log("endMinute",endMinute)

const endDate = moment(actualendDate)
.hours(endHour)
.minutes(endMinute);
        data.push({
          title: appointment.observation,
          start: startDate,
          end: endDate,
        });
      });

      res.status(200).send({
        message: "Appointment list",
        veterinarian: data,
      });
    } else {
      res.send({
        message: "not found",
        data: [],
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getSingleVeterinarians = async (req, res) => {
  try {
    const id = req.params.id;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const veterinarian = await Veterinarian.findByPk(id, {where:{unique},
      include: [
        {
          model: Appointment,
          as: "vetsAppointment",
        },
      ],
    });

    if (!veterinarian) {
      return res.status(404).send({ message: "Veterinarian not found" });
    }

    // Calculate total appointment count
    const totalAppointments = veterinarian.vetsAppointment.length;

    // Calculate pending appointment count
    const pendingAppointments = veterinarian.vetsAppointment.filter(
      (appointment) => appointment.status === "Pending"
    ).length;

    // Find the last appointment date and time
    let lastAppointment = null;
    if (veterinarian.vetsAppointment.length > 0) {
      veterinarian.vetsAppointment.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      lastAppointment = {
        date: veterinarian.vetsAppointment[0].date,
        time: veterinarian.vetsAppointment[0].scheduleEnd, // Change this according to your column name
      };
    }
    const veterinarianData = {
      workingDays: veterinarian.workingDays,
      id: veterinarian.id,
      specialityId: veterinarian.specialityId,
      avatar: veterinarian.avatar,
      name: veterinarian.name,
      surname: veterinarian.surname,
      speciality: veterinarian.speciality,
      identity: veterinarian.identity,
      dob: veterinarian.dob,
      phone: veterinarian.phone,
      email: veterinarian.email,
      password: veterinarian.password,
      sex: veterinarian.sex,
      address: veterinarian.address,
      department: veterinarian.department,
      district: veterinarian.district,
      start_time: veterinarian.start_time,
      end_time: veterinarian.end_time,
      emailToken: veterinarian.emailToken,
      createdAt: veterinarian.createdAt,
    };
    res.status(200).send({
      message: "veterinarian",
      veterinarianData,
      lastAppointment,
      totalAppointments,
      pendingAppointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const ownersByVeterinarian = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const veterinarians = await Appointment.findAll({
      where: { veterinarianId: req.params.veterinarianId ,unique},
      attributes: ["ownerId"],
    });

    const owners = await Owner.findAll({});
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    if (req.query.startDate && req.query.endDate) {
      const matchedOwners = owners
        .filter((owner) => {
          return (
            veterinarians.some((vet) => vet.ownerId === owner.id) &&
            new Date(owner.createdAt) >= startDate &&
            new Date(owner.createdAt) <= endDate
          );
        })
        .map(
          ({
            id,
            name,
            dob,
            surname,
            phone_1,
            phone_2,
            doc_identity,
            email,
            address,
            department,
            district,
          }) => ({
            id,
            name,
            dob,
            surname,
            phone_1,
            phone_2,
            doc_identity,
            email,
            address,
            department,
            district,
          })
        );

      res.status(200).send({
        message: "Owners matched by veterinarian",
        owners: matchedOwners,
      });
    } else {
      const matchedOwners = owners
        .filter((owner) => {
          return veterinarians.some((vet) => vet.ownerId === owner.id);
        })
        .map(
          ({
            id,
            name,
            dob,
            surname,
            phone_1,
            phone_2,
            doc_identity,
            email,
            address,
            department,
            district,
          }) => ({
            id,
            name,
            dob,
            surname,
            phone_1,
            phone_2,
            doc_identity,
            email,
            address,
            department,
            district,
          })
        );

      res.status(200).send({
        message: "Owners matched by veterinarian",
        owners: matchedOwners,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
const petsByVeterinarian = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const veterinarians = await Appointment.findAll({
      where: { veterinarianId: req.params.veterinarianId, unique },
      attributes: ["petId"],
    });

    const pets = await Pet.findAll({});
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    if (req.query.startDate && req.query.endDate) {
      const matchedPets = pets
        .filter((pet) => {
          console.log("pet");

          return (
            veterinarians.some((vet) => vet.petId === pet.id) &&
            new Date(pet.createdAt) >= startDate &&
            new Date(pet.createdAt) <= endDate
          );
        })
        .map(
          ({
            id,
            name,
            owner,
            sex,
            age,
            Species,
            breed,
            hair,
            color,
            status,
            exploration,
            dob,
          }) => ({
            id,
            name,
            owner,
            sex,
            age,
            Species,
            breed,
            hair,
            color,
            status,
            exploration,
            dob,
          })
        );

      res.status(200).send({
        message: "pets matched by veterinarian",
        pets: matchedPets,
      });
    } else {
      const matchedPets = pets
        .filter((pet) => {
          return veterinarians.some((vet) => vet.petId === pet.id);
        })
        .map(
          ({
            id,
            name,
            owner,
            sex,
            age,
            Species,
            breed,
            hair,
            color,
            status,
            exploration,
            dob,
          }) => ({
            id,
            name,
            owner,
            sex,
            age,
            Species,
            breed,
            hair,
            color,
            status,
            exploration,
            dob,
          })
        );

      res.status(200).send({
        message: "pets matched by veterinarian",
        pets: matchedPets,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
module.exports = {
  createVeterinarian,
  updateVeterinarian,
  deleteVeterinarian,
  getAllVeterinarians,
  getSingleVeterinarians,
  veterinarianExcelFile,
  veterinarianFilter,
  appointmentData,
  appointmentDataBySingleVeterinarian,
  ownersByVeterinarian,
  petsByVeterinarian,
};
