const prisma = require("../prismaClient");
const { generateCampaign } = require("../services/aiService");

const generate = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const aiResult = await generateCampaign(prompt);

    let audienceSize = 0;

    if (
      prompt.toLowerCase().includes("5000")
    ) {
      audienceSize = await prisma.customer.count({
        where: {
          totalSpent: {
            gt: 5000,
          },
        },
      });
    } else {
      audienceSize = await prisma.customer.count();
    }

    res.status(200).json({
      success: true,
      segmentName: aiResult.segmentName,
      channel: aiResult.channel,
      message: aiResult.message,
      audienceSize,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  generate,
};