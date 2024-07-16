import { IUser } from "../../../typings/User";

/**
 * User entity class
 */
export class User implements Readonly<IUser> {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public role: "admin" | "standard" | string,
    public token: string
  ) {}
}
