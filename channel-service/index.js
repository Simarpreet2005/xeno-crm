const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/send", async (req, res) => {
  const { communicationId } = req.body;

  res.json({
    success: true,
    message: "Communication queued",
  });

  const r = Math.random();
  let eventsToSend = [];

  if (r < 0.10) {
    eventsToSend = ["DELIVERED", "OPENED", "READ", "CLICKED"];
  } else if (r < 0.25) {
    eventsToSend = ["DELIVERED", "OPENED", "READ"];
  } else if (r < 0.45) {
    eventsToSend = ["DELIVERED", "OPENED"];
  } else if (r < 0.85) {
    eventsToSend = ["DELIVERED"];
  }

  eventsToSend.forEach((event, index) => {
    setTimeout(async () => {
      try {
        await axios.post(
          "http://localhost:5000/receipt",
          {
            communicationId,
            status: event,
          }
        );

        console.log(
          `Communication ${communicationId} -> ${event}`
        );
      } catch (error) {
        console.log(error.message);
      }
    }, (index + 1) * 3000);
  });
});

app.listen(6000, () => {
  console.log(
    "Channel Service Running On Port 6000"
  );
});