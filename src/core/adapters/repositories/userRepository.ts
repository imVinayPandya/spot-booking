import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";
import { objectToCamel } from "ts-case-convert";

import { IUser, IUserRepository } from "../../../typings/User";
import prismaClient from "../../../db/dbConnector";

@injectable()
export class UserRepository implements IUserRepository {
  private dbClient: PrismaClient;

  constructor() {
    this.dbClient = prismaClient;
  }

  async getUserByToken(token: string): Promise<IUser | null> {
    const data = await this.dbClient.users.findFirst({
      where: {
        token,
      },
    });

    return data ? objectToCamel(data) : data;
  }
}
