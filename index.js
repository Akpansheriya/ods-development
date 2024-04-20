const express = require("express");
const app = express();
const port = process.env.PORT || 2000;
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const usersRouteHandler = require("./routes/veterinaria/Admin/usersRoutes");
const paymentRouteHandler = require("./routes/veterinaria/Payment/payment");
const productRouteHandler = require("./routes/veterinaria/Products/product");
const vaccineRouteHandler = require("./routes/veterinaria/Vaccine/vaccine");
const ownerRouteHandler = require("./routes/veterinaria/Owner/owner");
const petRouteHandler = require("./routes/veterinaria/Pet/pet");
const appointmentRouteHandler = require("./routes/veterinaria/Appointment/appointment");
const vaccinationRouteHandler = require("./routes/veterinaria/vaccination/vaccination");
const veterinarianRouteHandler = require("./routes/veterinaria/Veterinarian/veterinarian");
const dashboardRouteHandler = require("./routes/veterinaria/Resumen/resumen");
const { sequelize } = require("./config/connection");
const schedule = require('node-schedule');
const { updateAppointmentsStatus } = require("./controllers/Veterinaria/Appointment/appointmentController");
const { updateProductStatus } = require("./controllers/Veterinaria/Products/productController");




  // schedule.scheduleJob('*/1 * * * * *', () => {
  //   updateProductStatus();
  //   updateAppointmentsStatus();
  // });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/users", usersRouteHandler);
app.use("/payment", paymentRouteHandler);
app.use("/product", productRouteHandler);
app.use("/vaccine", vaccineRouteHandler);
app.use("/owner", ownerRouteHandler);
app.use("/pet", petRouteHandler);
app.use("/dashboard", dashboardRouteHandler);
app.use("/veterinarian",veterinarianRouteHandler)
app.use("/appointment", appointmentRouteHandler);
app.use("/vaccination", vaccinationRouteHandler);
app.use("/profile", express.static("./public"));


app.get('/', (req, res) => {
  const databaseName = req.cookies.databaseName;
  const connectionConfig = getConnectionConfig(databaseName);
  console.log('Connection configuration:', connectionConfig);
  res.send('Database connection configured successfully!');
});



  sequelize
    .sync()
    .then(() => {
    
      app.listen(port, () => {
        console.log(`Server listening on :: http://localhost:${port}`);
      });
    })
    .catch((err) => {
      console.log("Error synchronizing models with the database:", err);
    });



app.get("/", (req, res) => {
  res.send("hello from backend side");
});
