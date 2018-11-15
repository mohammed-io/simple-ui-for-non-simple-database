import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import Order from "./order";

@Entity({name: 'order_comments'})
export default class OrderComment {
  @PrimaryGeneratedColumn({name: 'order_comment_id'})
  id: number;
  
  @Column({name: 'content'})
  content: string;

  @Column({name: 'order_id'})
  orderId: number;

  @Column({name: 'user_id'})
  userId: number;

  @Column({name: 'create_at'})
  createdAt: Date;

  @ManyToOne(_ => Order, order => order.comments)
  @JoinColumn({name: 'order_id'})
  order: Order
}