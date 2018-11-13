import { Express } from "express";
import { Server } from 'next-server'
import OrderRepository from "../repositories/order-repository";

export const registerRoutes = (server: Express, app?: Server) => {
  (() => app)

  server.get('/orders', async (req, res) => {
    const ordersRepository = await OrderRepository.getSingleton();

    const {page = 1, pageSize = 10} = req.query;

    const result = await ordersRepository.find({take: pageSize, skip: (page - 1) * pageSize})

    res.json(result.map(order => {
      const names = JSON.parse(order.merchant.name);
      return {...order, merchant: {...order.merchant, ...{
        nameEn: names.en
      }}}
    }))
  });
};
