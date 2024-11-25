const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

router.get("/", async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const includeOrders = req.user
    ? { where: { userId: req.user.id } }
    : false;
  try {
    const product = await prisma.product.findUniqueOrThrow({
      where: { id: +id },
      include: { orders: includeOrders },
    });
    res.json(product);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
