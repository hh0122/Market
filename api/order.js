const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");
const { authenticate } = require("./auth");
// send order made by logged in user
router.get("/", authenticate, async(req, res, next) => {
  try {
    const order = await prisma.order.findMany({
      where :{ userId: req.user.id},
      include: { product: true},
    })
    }catch (e){
      next(e);
  }
})

// POST 
router.post("/", authenticate, async (req, res, next) => {
  const { productId } = req.body;
  try {
    const order = await prisma.order.create({
      data: {
        productId: +productId,
        userId: req.user.id,
      }
    });
    res.status(201).json(order);
  }catch (e){
    next(e);
  }
});

