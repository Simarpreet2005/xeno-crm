const prisma = require("../prismaClient");

const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        orders: true,
      },
    });

    res.json(customers);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getCustomers,
};