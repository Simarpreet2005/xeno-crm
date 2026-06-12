const express = require("express");

const router = express.Router();

const {
  getCampaigns,
  createCampaign,
  launchCampaign,
  getCampaignAnalytics,
} = require("../controllers/campaignController");

router.get("/", getCampaigns);

router.post("/", createCampaign);

router.post("/:id/launch", launchCampaign);

router.get("/:id/analytics", getCampaignAnalytics);

module.exports = router;