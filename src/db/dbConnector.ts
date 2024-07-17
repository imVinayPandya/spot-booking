import { PrismaClient } from "@prisma/client";

let prismaClient: PrismaClient | null = null;

if (!prismaClient) {
  prismaClient = new PrismaClient();
}

export default prismaClient as PrismaClient;
