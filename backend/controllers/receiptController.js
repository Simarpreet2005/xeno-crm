const prisma = require("../prismaClient");

const receiveReceipt = async (req, res) => {
  try {
    const { communicationId, status } =
      req.body;

    await prisma.communication.update({
      where: {
        id: communicationId,
      },
      data: {
        status,
      },
    });

    res.json({
      success: true,
      communicationId,
      status,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  receiveReceipt,
};