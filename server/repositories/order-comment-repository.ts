import { Repository, EntityRepository } from "typeorm";
import { getConnection } from "../database/connection";
import OrderComment from "../models/order-comment";

@EntityRepository(OrderComment)
class OrderCommentRepository extends Repository<OrderComment> {
  private constructor() {
    super();
  }

  static getSingleton = async () => {
    const connection = await getConnection();
    return connection.getCustomRepository(OrderCommentRepository);
  };

  async findCommentsByOrderId(orderId: number) {
    return this.find({where: {
      orderId
    }});
  }
}

export default OrderCommentRepository;