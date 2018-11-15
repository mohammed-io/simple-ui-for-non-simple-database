import { Express } from "express";
import { Server } from "next-server";
import OrderRepository from "../repositories/order-repository";
import Order from "../models/order";
import OrderComment from "../models/order-comment";
import OrderCommentRepository from "../repositories/order-comment-repository";
import CustomerRepository from "../repositories/customer-repository";

export const registerRoutes = (server: Express, _?: Server) => {
  server.get("/foo", async (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;

    const repo = await OrderRepository.getSingleton();

    console.log(
      await repo
        .createQueryBuilder()
        .select(["Order_TABLE.order_id, Order.order_customer"])
        .from(Order, null)
        .innerJoin(
          OrderComment,
          null,
          "OrderComment_TABLE.order_id = Order.order_id"
        )
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .getMany()
    );

    // const result = await repo.query(
    //   `SELECT * FROM orders JOIN order_comments ON order_comments.order_id = orders.order_id LIMIT ? OFFSET ?`,
    //   [pageSize, (page - 1) * pageSize]
    // );

    const result = [];

    res.json(result);
  });

  server.get("/v1/customers/search", async (req, res) => {
    const repo = await CustomerRepository.getSingleton();

    const { term } = req.query;

    const result = await repo.searchByName(term);

    res.json(result)
  });

  server.get("/v1/orders/:orderId/comments", async (req, res) => {
    const { orderId } = req.params;

    const repo = await OrderCommentRepository.getSingleton();
    const comments = await repo.findCommentsByOrderId(orderId);

    res.json(comments);
  });

  server.post("/v1/orders/:orderId/comments", async (req, res) => {
    console.log(req.body);

    if (!req.body.text) return res.end();

    const repo = await OrderCommentRepository.getSingleton();

    const { orderId } = req.params;

    const newComment = repo.create({
      content: req.body.text,
      userId: 1,
      orderId,
      createdAt: new Date()
    });
    await repo.insert(newComment);

    res.json(newComment);
  });

  server.post("/v1/orders/:orderId/complete", async (req, res) => {
    const ordersRepository = await OrderRepository.getSingleton();

    const { orderId } = req.params;

    const orderToUpdate = await ordersRepository.findOne(orderId);
    orderToUpdate.status = "completed";
    ordersRepository.save(orderToUpdate);

    res.json(orderToUpdate);
  });

  server.post("/v1/orders/:orderId/cancel-and-refund", async (req, res) => {
    const ordersRepository = await OrderRepository.getSingleton();

    const { orderId } = req.params;

    const orderToUpdate = await ordersRepository.findOne(orderId);
    orderToUpdate.status = "canceledrefund";
    ordersRepository.save(orderToUpdate);

    res.json(orderToUpdate);
  });

  server.post("/v1/orders/:orderId/cancel", async (req, res) => {
    const ordersRepository = await OrderRepository.getSingleton();

    const { orderId } = req.params;

    const orderToUpdate = await ordersRepository.findOne(orderId);
    orderToUpdate.status = "canceled";
    ordersRepository.save(orderToUpdate);

    res.json(orderToUpdate);
  });

  server.post("/v1/orders/:orderId/process", async (req, res) => {
    const ordersRepository = await OrderRepository.getSingleton();

    const { orderId } = req.params;

    const orderToUpdate = await ordersRepository.findOne(orderId);
    orderToUpdate.status = "processing";
    ordersRepository.save(orderToUpdate);

    res.json(orderToUpdate);
  });

  server.get("/v1/orders", async (req, res) => {
    const ordersRepository = await OrderRepository.getSingleton();

    const { page = 1, pageSize = 10 } = req.query;

    const result = await ordersRepository.find({
      take: pageSize,
      skip: (page - 1) * pageSize
    });

    res.json(
      result.map(order => {
        const names = JSON.parse(order.merchant.name);
        return {
          ...order,
          merchant: {
            ...order.merchant,
            ...{
              nameEn: names.en
            }
          }
        };
      })
    );
  });

  server.patch("/v1/orders/:orderId", async (req, res) => {
    const ordersRepository = await OrderRepository.getSingleton();

    const { orderId } = req.params;

    const toUpdate = await ordersRepository.findOne(orderId);

    Object.assign(toUpdate, req.body);

    await ordersRepository.save(toUpdate);

    res.json(toUpdate);
  });
};
