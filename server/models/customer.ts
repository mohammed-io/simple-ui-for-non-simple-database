import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'customers'})
export default class Customer {
  @PrimaryGeneratedColumn({name: 'customer_id'})
  id: number;
  
  @Column({name: 'customer_name'})
  name: string;
}