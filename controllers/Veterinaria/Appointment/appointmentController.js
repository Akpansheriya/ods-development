const { Op, Sequelize } = require("sequelize");
const Database = require("../../../config/connection");
const Appointment = Database.appointment;
const ExcelJS = require("exceljs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const moment = require("moment");
const Admin = Database.user;
const createAppointment = async (req, res) => {
  try {
    
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique
    const appointment = {
      owner: req.body.owner,
      pet: req.body.pet,
      unique:unique,
      petId: req.body.petId,
      veterinarianId: req.body.veterinarianId,
      ownerId: req.body.ownerId,
      veterinarian: req.body.veterinarian,
      date: new Date(req.body.date),
      status: "pending",
      scheduleStart: req.body.scheduleStart,
      scheduleEnd: req.body.scheduleEnd,
      observation: req.body.observation,
      condition_name: req.body.condition_name,
      description: req.body.description,
      documentation: req.body.documentation,
      medication: req.body.medication,
      internal_observation: req.body.internal_observation,
      rating: 0,
    };

    if (appointment.owner === "" || appointment.owner === null) {
      res.status(400).json({
        message: "owner name is required",
      });
    } else if (
      appointment.veterinarian === "" ||
      appointment.veterinarian === null
    ) {
      res.status(400).json({
        message: "veterinarian name is required",
      });
    } else if (appointment.date === "" || appointment.date === null) {
      res.status(400).json({
        message: "date name is required",
      });
    } else if (
      appointment.scheduleStart === "" ||
      appointment.scheduleStart === null
    ) {
      res.status(400).json({
        message: "scheduleStart is required",
      });
    } else if (
      appointment.scheduleEnd === "" ||
      appointment.scheduleEnd === null
    ) {
      res.status(400).json({
        message: "scheduleEnd is required",
      });
    } else if (appointment.pet === "" || appointment.pet === null) {
      res.status(400).json({
        message: "pet name is required",
      });
    } else {
      Appointment.create(appointment).then((result) => {
        res.status(201).json({
          message: "appointment created",
          result: result,
        });
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error Registering appointment",
      error: error.message,
    });
  }
};

const registerDiagnostic = async (req, res) => {
  try {
    const id = req.params.id;
    const appointmentExist = await Appointment.findOne({ where: { id: id } });
    const documentationFiles = req.files;
    const array = documentationFiles.reduce((acc, file, i) => {
      const uploadedFileName = req.files[i].originalname;
      acc.push({
        [uploadedFileName]: `${req.protocol}://${req.get("host")}/profile/appointment/${file.filename}`,
      });
      return acc;
    }, []);
    const documentation_array = array;
    let medication = null;
    if (req.body.medication !== "" || req.body.medication )  {
      try {
        medication = JSON.parse(req.body.medication);
      } catch (error) {
        return res.status(400).send({ message: "Invalid medication data format" });
      }
    }
    const appointment = {
      condition_name: req.body.condition_name,
      description: req.body.description,
      documentation: documentation_array, // Assuming documentation_array is correctly formatted
      medication: medication,
      internal_observation: req.body.internal_observation || null,
      status: "complete",
      rating: req.body.rating,
    };
    if (appointmentExist) {
      if (!appointment.condition_name) {
        return res.status(400).send({ message: "Condition name is required" });
      }
      if (!appointment.description) {
        return res.status(400).send({ message: "Description is required" });
      }
      if (!appointment.rating) {
        return res.status(400).send({ message: "Rating is required" });
      }
      await Appointment.update(appointment, { where: { id: id } });
      res.status(200).send({ message: "Appointment record updated successfully" });
    } else {
      res.status(404).send({ message: "Appointment record not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error updating appointment", error: error.message });
  }
};
const updateAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const appointmentExist = await Appointment.findOne({ where: { id: id } });

    const appointment = {
      owner: req.body.owner,
      pet: req.body.pet,
      petId: req.body.petId,
      veterinarianId: req.body.veterinarianId,
      ownerId: req.body.ownerId,
      veterinarian: req.body.veterinarian,
      date: new Date(req.body.date),
      status: "pending",
      scheduleStart: req.body.scheduleStart,
      scheduleEnd: req.body.scheduleEnd,
      observation: req.body.observation,
    };

    if (appointmentExist) {
      if (appointment.owner === "" || appointment.owner === null) {
        res.status(400).json({
          message: "owner name is required",
        });
      } else if (
        appointment.veterinarian === "" ||
        appointment.veterinarian === null
      ) {
        res.status(400).json({
          message: "veterinarian name is required",
        });
      } else if (appointment.date === "" || appointment.date === null) {
        res.status(400).json({
          message: "date name is required",
        });
      } else if (
        appointment.scheduleStart === "" ||
        appointment.scheduleStart === null
      ) {
        res.status(400).json({
          message: "scheduleStart is required",
        });
      } else if (
        appointment.scheduleEnd === "" ||
        appointment.scheduleEnd === null
      ) {
        res.status(400).json({
          message: "scheduleEnd is required",
        });
      } else if (appointment.pet === "" || appointment.pet === null) {
        res.status(400).json({
          message: "pet name is required",
        });
      }else {
        await Appointment.update(appointment, { where: { id: id } });
        res.status(200).send({
          message: "appointment record updated successfully",
        });
      }
     
    } else {
      res.status(404).send({
        message: "appointment record not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating appointment",
      error: error.message,
    });
  }
};
const deleteAppointmentRecord = async (req, res) => {
  try {
    const id = req.params.id;
    const appointment_record = await Appointment.findOne({ where: { id: id } });
    const { pass, email } = req.body;

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const user = await Admin.findOne({
      where: { email: email },
    });
    if (!user) {
      return res.status(400).send({
        message: "Not authorized",
        success: false,
      });
    }

    if (decoded.role !== user.role) {
      return res.status(400).send({
        message: "Not authorized",
        success: false,
      });
    }
    if (pass !== user.password) {
      return res.status(400).send({
        message: "Password doesn't match",
        success: false,
      });
    }

    if (!appointment_record) {
      return res.status(400).send({
        message: "Record not found",
        success: false,
      });
    }

    if (appointment_record.documentation !== null) {
      const myArray = JSON.parse(appointment_record.documentation);

      if (myArray.length > 0) {
        myArray.map((docPath) => {
          const fileName = Object.keys(docPath)[0];
          const imagePath = `./public/appointment/${fileName}`;

          fs.unlinkSync(imagePath, async (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });
        });
      }
    }

    await Appointment.destroy({ where: { id: id } });

    return res.status(200).send({
      message: "Appointment deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return res.status(500).send({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const appointmentExcelFile = async (req, res) => {
  try {
    const appointmentData = await Appointment.findAll({});
    const plainAppointmentData = appointmentData.map((appointment) => {
      const formattedAppointment = appointment.get({ plain: true });

      // Rename headers
      formattedAppointment.COD = formattedAppointment.id;

      formattedAppointment.Mascota = formattedAppointment.pet;
      formattedAppointment.Veterinario = formattedAppointment.veterinarian;
      formattedAppointment.Horario = `${formattedAppointment.scheduleStart} - ${formattedAppointment.scheduleEnd}`;
      formattedAppointment.Fecha = formatDate(formattedAppointment.date);
      formattedAppointment.Calificación  = `${formattedAppointment.rating} /5`;
      formattedAppointment.Estado = formattedAppointment.status;
      
      

    

     
      
     
      

      // Remove unwanted fields
      const unwantedFields = [
        "createdAt",
        "updatedAt",
        "id",
        "pet",
        "veterinarian",
        "scheduleStart",
        "observation",
        "scheduleEnd",
        "rating",
        "status",
        "petId",
        "ownerId",
        "medication",
        "date",
        "owner",
        "condition_name",
        "description",
        "documentation",
        "internal_observation",
        "veterinarianId",
      ];
      unwantedFields.forEach((field) => delete formattedAppointment[field]);

      return formattedAppointment;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("appointments");
  
    // Add merged cells for title and image
    worksheet.mergeCells("A1:B2");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "Lista De Citas";
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
    const headers = Object.keys(plainAppointmentData[0]);
    worksheet.addRow(headers);
  
    // Write data to the worksheet
    plainAppointmentData.forEach((appointment) => {
      const row = [];
      headers.forEach((header) => {
        row.push(appointment[header]);
      });
      worksheet.addRow(row);
    });
  
    // Format header row
    worksheet.getRow(4).eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDDDDD" } };
      cell.font = { size: 11, bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });
  
    // Format data rows and set colors based on the status
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 3) {
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
        });

        const estadoCell = row.getCell("G"); // Assuming "Estado" is in column G (7th column)
        const estadoValue = estadoCell.value;

        switch (estadoValue) {
          case "complete":
            estadoCell.value = "COMPLETADO"
            estadoCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "00B056" } }; // Green color (RGB 0,176,86)
            estadoCell.font = { color: { argb: "FFFFFF" } }; // White font color
            break;
          case "not complete":
            estadoCell.value = "NO ASISTIÓ"
            estadoCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDDDDD" } }; // Light gray color (RGB 221,221,221)
            estadoCell.font = { color: { argb: "000000" } }; // Black font color
            break;
          case "pending":
            estadoCell.value = "PENDIENTE"
            estadoCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "E1E100" } }; // Yellow color (RGB 225,225,0)
            estadoCell.font = { color: { argb: "000000" } }; // Black font color
            break;
          default:
            // Handle any other status or leave it unchanged
            break;
        }
      }
    });
  
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
  
    // Prepare the Excel file for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=appointment.xlsx");
  
    // Write the workbook data to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting Excel file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
}

const updateAppointmentsStatus = async () => {
  try {
    const currentTime = moment();

    const today = moment().startOf("day");

    const appointments = await Appointment.findAll();

    appointments.forEach(async (appointment) => {
      const scheduleEndTime = moment(appointment.scheduleEnd, "HH:mm");

      const isToday = moment(appointment.date).isSame(today, "day");
      const isGoneDays = moment(appointment.date).isBefore(today, "day");
      const sixHoursDuration = moment.duration(6, "hours");

      const addition = scheduleEndTime.clone().add(sixHoursDuration);

      if (isToday || isGoneDays) {
        if (addition.isSameOrBefore(currentTime)) {
          if (appointment.status === "pending") {
            await Appointment.update(
              { status: "no attempt" },
              { where: { id: appointment.id } }
            );
          }
        }
      }
    });
  } catch (error) {
    console.error("Error updating appointments:", error);
  }
};

const dateWiseAppointment = async (req, res) => {
  try {
    const { day, date } = req.query;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    let filteredAppointments = [];

    if (day && date) {
      // Find appointments for the given day and date
      filteredAppointments = await Appointment.findAll({
        where: {
          unique,
          [Op.and]: [
            Sequelize.literal(`DAYNAME(date) = '${day}'`),
            Sequelize.where(Sequelize.fn("DATE", Sequelize.col("date")), date),
          ],
        },
      });
    } else if (day) {
      // Find appointments for the given day
      filteredAppointments = await Appointment.findAll({
        where: Sequelize.literal(`DAYNAME(date) = '${day}'`),
      });
    } else if (date) {
      // Find appointments for the given date
      filteredAppointments = await Appointment.findAll({
        where: {
          date: {
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn("DATE", Sequelize.col("date")),
                date
              ),
              Sequelize.where(Sequelize.col("unique"), unique),
            ],
          },
        },
      });
    }

    res.status(200).send({
      message: "Appointments List",
      appointments: filteredAppointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};




const appointmentFilter = async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const status = req.query.status;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique
    if (!req.query.status && req.query.endDate && req.query.startDate) {
      console.log("startDate && endDate");
      const filteredRecords = await Appointment.findAll({
        where: {
          unique,
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      res.status(200).json({
        message: "Filtered records",
        appointmentList: filteredRecords,
      });
    } else if (req.query.status && req.query.startDate && req.query.endDate) {
      console.log("hello status && startDate && endDate ");
      const filteredRecords = await Appointment.findAll({
        where: {
          unique,
          status,
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      res.status(200).json({
        message: "Filtered records",
        appointmentList: filteredRecords,
      });
    } else if (!req.query.startDate && !req.query.endDate && req.query.status) {
      console.log("status");
      const filteredRecords = await Appointment.findAll({
        where: {
          unique,
          status,
        },
      });

      res.status(200).json({
        message: "Filtered records",
        appointmentList: filteredRecords,
      });
    } else if (
      !req.query.status &&
      !req.query.endDate &&
      !req.query.startDate
    ) {
      console.log("no one");
      const appointmentList = await Appointment.findAll({ 
        where:{unique},
        order: [
          ['createdAt', 'DESC']
        ]
      });
      res.status(200).json({
        message: "appointmentList",
        appointmentList,
      });
    }
  } catch (error) {
    console.error("Error filtering records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const AppointmentsOfDoctor = async (req, res) => {
  const veterinarianId = req.params.veterinarianId;
  const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique
  const appointments = await Appointment.findAll({
    where: { veterinarianId: veterinarianId ,unique},
    order: [["createdAt", "DESC"]],
  });
  res.status(200).send({
    message: "appointments",
    appointments,
  });
};
const getAllAppointments = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique
  const appointments = await Appointment.findAll({
    where:{unique},
    order: [["createdAt", "DESC"]],
  });
  res.status(200).send({
    message: "appointments",
    appointments,
  });
};
const getSingleAppointment = async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique
  const appointments = await Appointment.findAll({
    where: { id: id ,unique},
    order: [["createdAt", "DESC"]],
  });
  res.status(200).send({
    message: "appointments",
    appointments,
  });
};

module.exports = {
  createAppointment,
  updateAppointment,
  registerDiagnostic,
  deleteAppointmentRecord,
  appointmentExcelFile,
  updateAppointmentsStatus,
  appointmentFilter,
  AppointmentsOfDoctor,
  dateWiseAppointment,
  getAllAppointments,
  getSingleAppointment,
};
