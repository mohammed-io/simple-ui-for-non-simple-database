import {Express} from 'express';

export const resource = (server: Express) => (endpoint: string, handler) =>{
  server.get(endpoint, handler.handleAll);
  server.post(endpoint, handler.hadlerPost);
  server.get(`${endpoint}/:id`, handler.handleGet);
  server.patch(`${endpoint}/:id`, handler.handlePatch);
  server.delete(`${endpoint}/:id`, handler.handleDelete);
};