import { Repository, EntityRepository, Like } from "typeorm";
import Customer from "../models/customer";
import { getConnection } from "../database/connection";

@EntityRepository(Customer)
class CustomerRepository extends Repository<Customer> {
  private constructor() {
    super();
  }

  static getSingleton = async () => {
    const connection = await getConnection();
    return connection.getCustomRepository(CustomerRepository);
  };

  async searchByName(term, limit = 15) {
    return this.find({
      where: {
        name: Like(`%${term}%`)
      },
      take: limit
    });
  }
}

export default CustomerRepository;
