import express from 'express';
import { PORT } from './utils/constants.js';
import { users } from './utils/basicFunctions/users.js';
import { productFunction } from './utils/basicFunctions/products.js';
import { orderFunction } from './utils/basicFunctions/order.js';
import cors from 'cors';
import { join } from 'path';

const app = express();
app.use(express.json());
app.use(cors());
// app.use(express.static('assets'));

app.use(
  '/images',
  express.static(join(process.cwd(), 'backend', 'src', 'assets', 'img'))
);

users(app);
productFunction(app);
orderFunction(app);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
