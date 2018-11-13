import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm";
import Order from "./order";

@Entity({name: 'customers'})
export default class Customer {
  @PrimaryGeneratedColumn({name: 'customer_id'})
  id: number;
  
  @Column({name: 'customer_name'})
  name: string;

  @Column({name: 'customer_phone'})
  phone: string;

  @OneToMany(_ => Order, order => order.customer)
  @JoinColumn({name: "order_customer"})
  orders: Promise<Order[]>
}