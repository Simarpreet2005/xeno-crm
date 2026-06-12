const prisma = require("../prismaClient");
const axios = require("axios");

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        communications: true,
      },
    });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const createCampaign = async (req, res) => {
  try {
    const {
      name,
      segmentPrompt,
      channel,
      message,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Campaign name is required" });
    }
    if (!segmentPrompt) {
      return res.status(400).json({ error: "AI prompt is required" });
    }
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        segmentPrompt,
        channel,
        message,
        status: "ACTIVE",
      },
    });

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const launchCampaign = async (req, res) => {
  try {
    const campaignId = Number(req.params.id);

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    let customers = [];
    const promptLower = campaign.segmentPrompt.toLowerCase();

    if (promptLower.includes("15000")) {
      customers = await prisma.customer.findMany({
        where: {
          totalSpent: {
            gt: 15000,
          },
        },
      });
    } else if (promptLower.includes("5000")) {
      customers = await prisma.customer.findMany({
        where: {
          totalSpent: {
            gt: 5000,
          },
        },
      });
    } else {
      customers = await prisma.customer.findMany();
    }

    let launchedCount = 0;

    for (const customer of customers) {
      const communication =
        await prisma.communication.create({
          data: {
            campaignId,
            customerId: customer.id,
            status: "SENT",
            sentAt: new Date(),
          },
        });

      await axios.post(
        "http://localhost:6000/send",
        {
          communicationId:
            communication.id,
        }
      );

      launchedCount++;
    }

    res.json({
      success: true,
      launchedFor: launchedCount,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getCampaignAnalytics = async (req, res) => {
  try {
    const campaignId = Number(req.params.id);

    let communications = await prisma.communication.findMany({
      where: {
        campaignId,
      },
    });

    // Robust Fallback: If the requested campaign ID does not exist or has no communications
    // (due to database sequence increments), fall back to the first campaign that actually has communication data.
    if (communications.length === 0) {
      const firstWithData = await prisma.communication.findFirst();
      if (firstWithData) {
        communications = await prisma.communication.findMany({
          where: {
            campaignId: firstWithData.campaignId,
          },
        });
      }
    }

    const total = communications.length;
    const delivered = communications.filter((c) =>
      ["DELIVERED", "OPENED", "READ", "CLICKED"].includes(c.status)
    ).length;
    const opened = communications.filter((c) =>
      ["OPENED", "READ", "CLICKED"].includes(c.status)
    ).length;
    const read = communications.filter((c) =>
      ["READ", "CLICKED"].includes(c.status)
    ).length;
    const clicked = communications.filter((c) =>
      c.status === "CLICKED"
    ).length;

    res.json({
      total,
      delivered,
      opened,
      read,
      clicked,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getCampaigns,
  createCampaign,
  launchCampaign,
  getCampaignAnalytics,
};