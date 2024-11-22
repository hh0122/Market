const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// create token;

const createToken = () => {
  return jwt.sign({id}, JWT_SECRET, { expiresIn :"1d"});
}

const prisma = require("../prisma");
// grab token from headers only if it exists
router.use( async (req, res, next )=> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7); 
  if (!token) return next();
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
    });
    req.user = user;
    next();
  }catch (e){
    next(e);
  }
});

// POST/register
router.post("/register", async (req, res, next) => {
  const {email, password} = req.body;
  try {
    const user = await prisma.user.register(email,password);
    const token = createToken( user.id);
    res.status(201).json({ token });
  }catch (e){
    next(e);
  }
});

// POST/login

router.post("/login", async (req, res, next) => {
  const { username, password } =req.body;
  try {
    const user = await prisma.user.login(email, password);
    const token = createToken(user.id);
    res.json({ token });
  } catch (e) {
    next (e);
  }
});

// checks the request for an authenticated user
function authentication( req, res, next ){
  if (req.user){
    next();
  } else {
    next( { status :401, message: " You must be logged in."})
  }
}

module.exports = {
  router,
  authentication,
}