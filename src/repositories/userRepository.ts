import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";
import { objectToSnake, objectToCamel } from "ts-case-convert";

import { IUser, IUserRepository } from "../typings/User";

@injectable()
export class UserRepository implements IUserRepository {
  private dbClient: PrismaClient;

  constructor() {
    this.dbClient = new PrismaClient();
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
