const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const apiV1Router = require("./routes/v1/v1.router");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Mount all routes
app.use("/api/v1", apiV1Router);

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
