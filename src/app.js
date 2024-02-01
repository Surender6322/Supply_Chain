const express = require("express");
require("./db/index");


const app = express();
const port = process.env.PORT;

const userRouter = require("./routers/user")
const inventoryRouter = require("./routers/inventory")
const shipmentRouter = require("./routers/shipment")
const reportRouter = require("./routers/reports")

app.use(express.json());
app.use(userRouter)
app.use(inventoryRouter)
app.use(shipmentRouter)
app.use(reportRouter)

app.get("/", (req, res) => {
  res.send("Welcome to the app");
});

app.listen(port, () => {
  console.log(`The server is up and running on ${port}`);
});
