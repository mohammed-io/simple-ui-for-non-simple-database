import * as next from 'next'
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { registerRoutes } from './routes';

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express();
  
  server.use(bodyParser.json());
  
  registerRoutes(server, app);

  server.get('*', (req, res) => {
    return handle(req, res);
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
