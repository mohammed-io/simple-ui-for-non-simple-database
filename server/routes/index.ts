import { Express } from "express";
import { getConnection } from "../database/connection";

export const registerRoutes = (server: Express) => {
  server.get("/foo", async (_, _2) => {
    const connection = await getConnection();

    connection.query("SELECT * FROM orders LIMIT 1")
      .then(arr => console.dir(arr[0]))

  });
};
