export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "standard" | string;
  token: string;
}

export interface IUserRepository {
  // create(user: IUser): Promise<IUser>;
  // getById(id: string): Promise<IUser | null>;
  // getByEmail(email: string): Promise<IUser | null>;
  // update(id: string, user: Partial<IUser>): Promise<IUser>;
  // delete(id: string): Promise<boolean>;
  getUserByToken(token: string): Promise<IUser | null>;
}
