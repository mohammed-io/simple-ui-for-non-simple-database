import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  OneToMany
} from "typeorm";
import Order from "./order";

@Entity({ name: "merchants" })
export default class Merchant {
  @PrimaryGeneratedColumn({name: 'merchant_id'})
  id: number;
  
  @Column({name: 'merchant_name'})
  name: string;

  @OneToMany(_ => Order, order => order.merchant)
  @JoinColumn({name: 'order_merchant'})
  orders: Order[]
}