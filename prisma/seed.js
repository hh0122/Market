const {faker, ar} = require("@faker-js/faker");
const {PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const seed = async (numProducts = 20) => {
  const products = Array.from({ length: numProducts }, () => ({
    title:  faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
  }));
  await prisma.product.createMany({ data: products});
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect();
    process.exit(1);
  });


