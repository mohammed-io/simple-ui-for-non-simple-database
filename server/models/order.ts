import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from "typeorm";
import Customer from "./customer";
import Merchant from "./merchant";

@Entity({ name: "orders" })
export default class Order {
  @PrimaryGeneratedColumn({ name: "order_id" })
  id: number;

  @Column({ name: "order_customer" })
  customerId: number;

  @Column({ name: "order_merchant" })
  merchantId: number;

  @Column({name: "order_status"})
  status: string;

  @Column({name: 'order_date_added'})
  date: Date;

  @ManyToOne(_ => Customer, customer => customer.orders, {eager: true})
  @JoinColumn({ name: "order_customer"})
  customer: Customer;

  @ManyToOne(_ => Merchant, merchant => merchant.orders, {eager: true})
  @JoinColumn({name: 'order_merchant'})
  merchant: Merchant;
}
