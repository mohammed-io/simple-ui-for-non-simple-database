import { Repository, EntityRepository } from "typeorm";
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
}

export default CustomerRepository;