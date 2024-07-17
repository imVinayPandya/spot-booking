import { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import prismaClient from "./dbConnector";

jest.mock("./dbConnector", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

export const prismaMock =
  prismaClient as unknown as DeepMockProxy<PrismaClient>;
