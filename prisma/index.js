const bcrypt = require("bcrypt");

const {PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient().$extends({
  model: {
    user: {
      // create  a new user with the provided credentials

      async register(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: { username, password: hashedPassword}, 
        });
        return user;
      },
      
      // find user with the provided username
      async login(username, password) {
        const user = await prisma.user.findUniqueOrThrow({
          where: {username},
        });
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) throw Error("Invalid Password");
        return user;
      },
    },
  },
});

module.exports = prisma;