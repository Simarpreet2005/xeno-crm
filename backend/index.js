const express = require("express");
const cors = require("cors");
require("dotenv").config();

const customerRoutes = require("./routes/customerRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const aiRoutes = require("./routes/aiRoutes");
const receiptRoutes = require("./routes/receiptRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Xeno CRM API Running");
});

app.use("/customers", customerRoutes);
app.use("/campaigns", campaignRoutes);
app.use("/ai", aiRoutes);
app.use("/receipt", receiptRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});