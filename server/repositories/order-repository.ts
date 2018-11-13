import { Repository, EntityRepository } from "typeorm";
import { getConnection } from "../database/connection";
import Order from "../models/order";

@EntityRepository(Order)
class OrderRepository extends Repository<Order> {
  private constructor() {
    super();
  }

  static getSingleton = async () => {
    const connection = await getConnection();
    return connection.getCustomRepository(OrderRepository);
  };
}

export default OrderRepository;