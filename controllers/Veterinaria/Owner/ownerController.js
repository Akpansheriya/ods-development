const { Op } = require("sequelize");
const Database = require("../../../config/connection");
const Owner = Database.owner;
const Vaccination = Database.vaccination;
const Appointment = Database.appointment;
const jwt = require("jsonwebtoken");
const ExcelJS = require("exceljs");
const Pet = Database.pet;
const Admin = Database.user;
const createOwner = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const owner = {
      name: req.body.name,
      surname: req.body.surname,
      unique:unique,
      phone_1: req.body.phone_1,
      phone_2: req.body.phone_2,
      doc_identity: req.body.doc_identity,
      email: req.body.email,
      address:
        req.body.address === "" || !req.body.address ? null : req.body.address,
      dob: req.body.dob === "" || !req.body.dob ? null : new Date(req.body.dob),
      department:
        req.body.department === "" || !req.body.department
          ? null
          : req.body.department,
      district:
        req.body.district === "" || !req.body.district
          ? null
          : req.body.district,
    };
    if (owner.name === "" || owner.name === null) {
      res.status(400).send({
        message: "name is required",
      });
    } else if (owner.surname === "" || owner.surname === null) {
      res.status(400).send({
        message: "surname is required",
      });
    } else if (owner.phone === "" || owner.phone === null) {
      res.status(400).send({
        message: "phone is required",
      });
    } else if (owner.doc_identity === "" || owner.doc_identity === null) {
      res.status(400).send({
        message: "doc_identity is required",
      });
    } else if (owner.email === "" || owner.email === null) {
      res.status(400).send({
        message: "email is required",
      });
    } else {
      Owner.create(owner).then((result) => {
        res.status(201).send({
          message: "owner created",
          result: result,
        });
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error Registering Payment",
      error: error.message,
    });
  }
};

const updateOwner = async (req, res) => {
  try {
    const id = req.params.id;
    const ownerExist = await Owner.findOne({ where: { id: id } });

    const owner = {
      name: req.body.name,
      surname: req.body.surname,
      owner: req.body.owner,
      phone_1: req.body.phone_1,
      phone_2: req.body.phone_2,
      doc_identity: req.body.doc_identity,
      email: req.body.email,
      address: req.body.address,
      dob: req.body.dob === "" || !req.body.dob ? null : new Date(req.body.dob),
      department: req.body.department,
      district: req.body.district,
    };

    if (ownerExist) {
      if (owner.name === "" || owner.name === null) {
        res.status(400).send({
          message: "name is required",
        });
      } else if (owner.surname === "" || owner.surname === null) {
        res.status(400).send({
          message: "surname is required",
        });
      } else if (owner.phone === "" || owner.phone === null) {
        res.status(400).send({
          message: "phone is required",
        });
      } else if (owner.doc_identity === "" || owner.doc_identity === null) {
        res.status(400).send({
          message: "doc_identity is required",
        });
      } else if (owner.email === "" || owner.email === null) {
        res.status(400).send({
          message: "email is required",
        });
      }else{
        await Owner.update(owner, { where: { id: id } });
        res.status(200).send({
          message: "owner record updated successfully",
        });
      }
     
    } else {
      res.status(404).send({
        message: "owner record not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating owner",
      error: error.message,
    });
  }
};
const deleteOwnerRecord = async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const owner_record = await Owner.findOne({ where: { id: id } });
  const { pass, email } = req.body;
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
  if (owner_record?.id === id) {
    await Owner.destroy({ where: { id: id } });
    await Pet.destroy({ where: { ownerId: id } });
    await Appointment.destroy({ where: { ownerId: id } });
    await Vaccination.destroy({ where: { ownerId: id } });
    res.status(200).send({
      message: "owner deleted successfully",
      success: true,
    });
  } else {
    return res.status(404).send({
      message: "owner record not found",
      success: false,
    });
  }
};

const ownerExcelFile = async (req, res) => {
  try {
    const ownerData = await Owner.findAll({});
    const plainOwnerData = ownerData.map((owner) => {
      const formattedOwner = owner.get({ plain: true });
      formattedOwner.dob = formatDate(formattedOwner.dob);

      formattedOwner.COD = formattedOwner.id;
      formattedOwner.Propietario = formattedOwner.name;
      formattedOwner.Dirección = formattedOwner.address;
      formattedOwner.Teléfono = formattedOwner.phone_1;
      formattedOwner["Doc Identidad"] = formattedOwner.doc_identity;

      const unwantedFields = [
        "createdAt",
        "updatedAt",
        "id",
        "dob",
        "name",
        "surname",
        "phone_1",
        "phone_2",
        "doc_identity",
        "email",
        "address",
        "department",
        "district",
      ];

      unwantedFields.forEach((field) => delete formattedOwner[field]);

      return formattedOwner;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Appointments");

    worksheet.mergeCells("A1:B2");
    const mergedCell = worksheet.getCell("A1");
    mergedCell.value = "Lista De Propietarios";
    mergedCell.font = { size: 16, bold: true };
    mergedCell.alignment = { vertical: "middle", horizontal: "left" };

    worksheet.mergeCells("C1:D2");

    // Add the image to the worksheet
    const imageId = workbook.addImage({
      filename: "./public/ods.png",
      extension: "png",
    });

    const imageWidth = 200;
    const imageHeight = 50;

    worksheet.addImage(imageId, {
      tl: { col: 2.3, row: 0 },
      br: { col: 3.1, row: 2 },
      ext: { width: imageWidth, height: imageHeight },
    });

    worksheet.getCell("B1").border = {
      right: { style: "thin", color: { argb: "FFFFFF" } },
    };
    worksheet.getCell("B2").border = {
      right: { style: "thin", color: { argb: "FFFFFF" } },
    };
    // Assuming the first object in the data array contains all possible keys
    const headers = Object.keys(plainOwnerData[0]);
    worksheet.addRow(headers);

    plainOwnerData.forEach((appointment) => {
      const row = [];
      headers.forEach((header) => {
        row.push(appointment[header]);
      });
      worksheet.addRow(row);
    });

    // Adding rows with data
    plainOwnerData.forEach((owner) => {
      const row = [];
      headers.forEach((header) => {
        row.push(owner[header]);
      });
      worksheet.addRow(row);
    });
    worksheet.getRow(4).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "DDDDDD" },
      };
      cell.font = { size: 11, bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 3) {
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
        });
      }
    });

    worksheet.getColumn(1).width = 11.29;
    worksheet.getColumn(2).width = 57;
    worksheet.getColumn(3).width = 55.71;
    worksheet.getColumn(4).width = 16.71;
    worksheet.getColumn(5).width = 16.71;

    worksheet.eachRow((row) => {
      row.height = 21.75;
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Lista-De-Propietarios.xlsx"
    );

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

const getAllOwners = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const unique = decoded.unique;
  const ownersList = await Owner.findAll({where:{unique}, order: [["createdAt", "DESC"]] });
  res.status(200).send({
    message: "ownersList",
    ownersList,
  });
};

const getAllPetsByOwner = async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const unique = decoded.unique;
  try {
    const owner = await Owner.findByPk(id, {
      where:{unique},
      include: [
        {
          model: Pet,
          as: "ownerData",
        },
      ],
    });

    if (!owner) {
      return res.status(404).send({
        message: "Owner not found",
      });
    }

    const ownerName = owner.name;
    const pets = owner.ownerData;

    res.status(200).send({
      message: "Owner's pets",
      owner: ownerName,
      pets,
    });
  } catch (error) {
    console.error("Error fetching owner's pets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getSingleOwner = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const id = req.params.id;
    const totalPets = await Pet.count({ where: { ownerId: id } });
    const owner = await Owner.findByPk(id, {
      where:{unique},
      include: [
        {
          model: Appointment,
          as: "ownerAppointmentData",
        },
      ],
    });
    console.log("---------", owner);
    if (!owner) {
      return res.status(404).send({ message: "owner not found" });
    }

    // Calculate total appointment count
    const totalAppointments = owner.ownerAppointmentData.length;

    // Calculate pending appointment count
    const completeAppointments = owner.ownerAppointmentData.filter(
      (appointment) => appointment.status === "complete"
    ).length;

    // Find the last appointment date and time
    let lastAppointment = null;
    if (owner.ownerAppointmentData.length > 0) {
      owner.ownerAppointmentData.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      lastAppointment = {
        date: owner.ownerAppointmentData[0].date,
      };
    }
    const ownerData = {
      workingDays: owner.workingDays,
      id: owner.id,
      avatar: owner.avatar,
      name: owner.name,
      surname: owner.surname,
      doc_identity: owner.doc_identity,
      identity: owner.identity,
      dob: owner.dob,
      phone_1: owner.phone_1,
      phone_2: owner.phone_2,
      email: owner.email,
      address: owner.address,
      department: owner.department,
      district: owner.district,
      createdAt: owner.createdAt,
    };
    res.status(200).send({
      message: "owner",
      ownerData,
      lastAppointment,
      totalAppointments,
      completeAppointments,
      totalPets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
const petAppointmentDataOfOwner = async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const unique = decoded.unique;
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);
  const status = req.query.status;
  if (req.query.startDate && req.query.endDate && req.query.status) {
    const owners = await Owner.findOne({
      include: [
        {
          model: Appointment,
          as: "ownerAppointmentData",
          where: {
            
            [Op.and]: [
              {
                createdAt: {
                  [Op.gte]: startDate,
                  [Op.lte]: endDate,
                },
              },
              { status },
            ],
          },
        },
      ],
      where: { id: id ,unique},
    });
    const owner = owners?.name;
    const appointments = owners?.ownerAppointmentData
      ? owners?.ownerAppointmentData
      : [];
    res.status(200).send({
      message: "appointmentList",

      owner: owner,
      appointments: appointments,
    });
  } else if (req.query.startDate && req.query.endDate && !req.query.status) {
    const owners = await Owner.findOne({
      include: [
        {
          model: Appointment,
          as: "ownerAppointmentData",
          where: {
            [Op.and]: [
              {
                createdAt: {
                  [Op.gte]: startDate,
                  [Op.lte]: endDate,
                },
              },
            ],
          },
        },
      ],
      where: { id: id ,unique,},
     
    });
    const owner = owners?.name;
    const appointments = owners?.ownerAppointmentData
      ? owners?.ownerAppointmentData
      : [];
    res.status(200).send({
      message: "appointmentList",

      owner: owner,
      appointments: appointments,
    });
  } else if (!req.query.startDate && !req.query.endDate && req.query.status) {
    const owners = await Owner.findOne({
      include: [
        {
          model: Appointment,
          as: "ownerAppointmentData",
          where: {
            status,
          },
        },
      ],
      where: { id: id ,unique},
    });
    const owner = owners?.name;
    const appointments = owners?.ownerAppointmentData
      ? owners?.ownerAppointmentData
      : [];
    res.status(200).send({
      message: "appointmentList",

      owner: owner,
      appointments: appointments,
    });
  } else if (!req.query.startDate && !req.query.endDate && !req.query.status) {
    const owners = await Owner.findOne({
      include: [
        {
          model: Appointment,
          as: "ownerAppointmentData",
        },
      ],
      where: { id: id ,unique},
    });
    const owner = owners?.name;
    const appointments = owners?.ownerAppointmentData
      ? owners?.ownerAppointmentData
      : [];
    res.status(200).send({
      message: "appointmentList",

      owner: owner,
      appointments: appointments,
    });
  }
};

const ownerFilter = async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    if (req.query.startDate && req.query.endDate) {
      const filteredRecords = await Owner.findAll({
        where: {
          unique,
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      res.status(200).json({
        message: "Filtered records",
        ownersList: filteredRecords,
      });
    } else {
      const ownersList = await Owner.findAll({
        where:{ unique,},
        order: [["createdAt", "DESC"]],
      });
      res.status(200).send({
        message: "ownersList",
        ownersList,
      });
    }
  } catch (error) {
    console.error("Error filtering records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOwner,
  updateOwner,
  deleteOwnerRecord,
  ownerExcelFile,
  getAllOwners,
  ownerFilter,
  getAllPetsByOwner,
  petAppointmentDataOfOwner,
  getSingleOwner,
};
