const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");

  // Clear old data
  await prisma.communication.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();

  const customers = [];

  for (let i = 1; i <= 200; i++) {
    const totalSpent = Math.floor(Math.random() * 25000) + 500;

    const customer = await prisma.customer.create({
      data: {
        name: `Customer ${i}`,
        email: `customer${i}@gmail.com`,
        phone: `98765${String(i).padStart(5, "0")}`,
        totalSpent,
        lastOrderDate: new Date(
          Date.now() -
            Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000
        ),
      },
    });

    customers.push(customer);
  }

  console.log(`Created ${customers.length} customers`);

  // Orders
  for (const customer of customers) {
    const orderCount = Math.floor(Math.random() * 8) + 1;

    for (let j = 0; j < orderCount; j++) {
      await prisma.order.create({
        data: {
          customerId: customer.id,
          amount: Math.floor(Math.random() * 5000) + 200,
          orderDate: new Date(
            Date.now() -
              Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000
          ),
        },
      });
    }
  }

  console.log("Orders created");

  // Campaigns
  const campaign1 = await prisma.campaign.create({
    data: {
      name: "Win Back Dormant Users",
      segmentPrompt:
        "Customers who spent over ₹5000 and haven't ordered in 60 days",
      channel: "WHATSAPP",
      message: "We miss you! Enjoy 15% off.",
      status: "ACTIVE",
    },
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      name: "Premium Shopper Offer",
      segmentPrompt: "Customers with spending above ₹15000",
      channel: "EMAIL",
      message: "Exclusive premium member rewards.",
      status: "ACTIVE",
    },
  });

  // Communications
  const statuses = [
    "SENT",
    "DELIVERED",
    "OPENED",
    "READ",
    "CLICKED",
    "FAILED",
  ];

  for (let i = 0; i < 500; i++) {
    const customer =
      customers[Math.floor(Math.random() * customers.length)];

    const campaignId =
      Math.random() > 0.5 ? campaign1.id : campaign2.id;

    await prisma.communication.create({
      data: {
        campaignId,
        customerId: customer.id,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        sentAt: new Date(),
        openedAt:
          Math.random() > 0.5
            ? new Date()
            : null,
        converted: Math.random() > 0.85,
      },
    });
  }

  console.log("Communications created");
  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });