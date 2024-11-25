const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const { authenticate } = require("./auth");

// Get all orders for logged in user
router.get("/", authenticate, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { 
        products: true,  
        user: true      
      },
    });
    res.json(orders);
  } catch (e) {
    next(e);
  }
});

// Create new order
router.post("/", authenticate, async (req, res, next) => {
  const { productId, date, note } = req.body;
  
  try {
    const order = await prisma.order.create({
      data: {
        date: date ? new Date(date) : new Date(),
        note: note || "",
        userId: req.user.id,
        products: {
          connect: { id: +productId },
        },
      },
      include: {
        products: true,
        user: true
      }
    });
    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
});

module.exports = router;