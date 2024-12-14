const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Upsert categories (this ensures that if "electronics" or "clothing" exist, they won't be duplicated)
  const electronics = await prisma.category.upsert({
    where: { name: "electronics" },
    update: {},
    create: {
      name: "electronics",
    },
  });

  const clothing = await prisma.category.upsert({
    where: { name: "clothing" },
    update: {},
    create: {
      name: "clothing",
    },
  });

  // Create products
  await prisma.product.createMany({
    data: [
      { title: "Smartphone", price: 699.99, categoryId: electronics.id, thumbnail: "smartphone.jpg", rating: 4.5 },
      { title: "Laptop", price: 1299.99, categoryId: electronics.id, thumbnail: "laptop.jpg", rating: 4.2 },
      { title: "Headphones", price: 199.99, categoryId: electronics.id, thumbnail: "headphones.jpg", rating: 4.7 },
      { title: "T-Shirt", price: 19.99, categoryId: clothing.id, thumbnail: "tshirt.jpg", rating: 3.8 },
      { title: "Jeans", price: 49.99, categoryId: clothing.id, thumbnail: "jeans.jpg", rating: 4.0 },
    ],
    skipDuplicates: true,
  });

  // Fetch products to get their IDs for reviews
  const products = await prisma.product.findMany();

  // Create some reviews for the products
  await prisma.review.createMany({
    data: [
      {
        content: "Excellent product!",
        rating: 5,
        productId: products.find(p => p.title === "Smartphone").id,
      },
      {
        content: "Good value for money.",
        rating: 4,
        productId: products.find(p => p.title === "Laptop").id,
      },
      {
        content: "Sound quality is amazing!",
        rating: 5,
        productId: products.find(p => p.title === "Headphones").id,
      },
      {
        content: "Comfortable and well-fitting.",
        rating: 4,
        productId: products.find(p => p.title === "Jeans").id,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

module.exports = prisma;
