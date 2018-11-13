import { createConnection, Connection } from "typeorm";
import Customer from "../models/customer";

let connection = null;

export const getConnection = async () => {
  if (!connection) {
    connection = await createConnection({
      type: "mysql",
      host: "localhost",
      port: 3333,
      username: "root",
      password: "11223344",
      database: "test",
      entities: [Customer],
    });
  }
  return connection as Connection;
};
