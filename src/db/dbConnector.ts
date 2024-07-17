import { Pool } from "pg";

let client: Pool;

export const pgClient = (): Pool => {
  if (!client) {
    client = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
  }
  return client;
};
