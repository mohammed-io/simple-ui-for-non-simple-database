import { Repository, EntityRepository, Like } from "typeorm";
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

  async findByIdOrNameWithCount(term, page = 1, pageSize = 10) {
    return this.findAndCount({
      where: [
        {
          id: Like(`%${term}%`)
        },
        { status: Like(`%${term}%`) }
      ],
      take: pageSize,
      skip: (page - 1) * pageSize
    });
  }
}

export default OrderRepository;
