const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const connectDB = require("./database");

require("dotenv").config();

const PORT = process.env.PORT;

connectDB();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ extended: false }));

app.listen(PORT);

app.get("/api/", (req, res) => {
  res.send("Reyes y Poncho Api");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/confirmations", require("./routes/confirmations"));