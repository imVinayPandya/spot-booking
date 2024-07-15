import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.users.create({
    data: {
      id: "user-1",
      first_name: "vinay",
      last_name: "pandya",
      email: "vinay@mail.com",
      role: "admin",
      token: "token-1",
    },
  });

  await prisma.users.create({
    data: {
      id: "user-2",
      first_name: "shivam",
      last_name: "pandya",
      email: "shivam@mail.com",
      role: "standard",
      token: "token-2",
    },
  });

  await prisma.parking_spots.create({
    data: {
      id: "abc-1",
      name: "table_one",
    },
  });

  await prisma.parking_spots.create({
    data: {
      id: "abc-2",
      name: "table_two",
    },
  });
}

if (process.env.NODE_ENV === "development") {
  main()
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
} else {
  console.log("Seed data can only be inserted in development environment");
}
