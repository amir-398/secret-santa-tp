const express = require("express");
const app = express();
const port = 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./docs/swaggerConfig");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/secretSantaTp");
app.use(express.urlencoded());
app.use(express.json());

// app use swagger api doc
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// app use userRoute
const userRoute = require("./routes/userRoute");
app.use("/users", userRoute);

//app use groupRoutee
const groupRoute = require("./routes/groupRoute");
app.use("/groups", groupRoute);

// app use StantaRoute
const santaRoute = require("./routes/santaRoute");
app.use("/santa", santaRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
