import { readFile, writeFile } from '../filesystem.js';
import { errorFunction, succesfullFunction } from '../helpers.js';

export const orderFunction = (app) => {
  app.get('/orders/:id', (req, res) => {
    try {
      const orders = readFile('orders.json');
      const id = req.params.id;

      if (!id) {
        errorFunction(res, 400, 'json', 'Bad Request');
        return;
      }

      const findedOrder = orders.find((order) => order.id === +id);

      findedOrder
        ? succesfullFunction(res, 200, findedOrder, 'json')
        : errorFunction(res, 404, 'json', 'Order not found');
    } catch (err) {
      res.status(err.code);
      res.send();
    }
  });

  app.post('/orders/:id', (req, res) => {
    try {
      const orders = readFile('orders.json');
      const users = readFile('users.json');
      const products = readFile('products.json');
      const userId = req.params.id;
      const data = req.body;
      const { productId, count } = data;
      const findedUser = users.find((user) => user.id == userId);
      const findedProduct = products.find((product) => product.id == productId);

      if (Object.keys(data) > 2 || !userId || !count || !productId) {
        errorFunction(res, 400, 'json', 'Bad Request');
        return;
      }
      console.log(userId);

      if (!findedUser) {
        errorFunction(res, 400, 'json', 'User not found');
        return;
      }

      if (!findedProduct) {
        errorFunction(res, 400, 'json', 'Product not found');
        return;
      }

      const newOrder = {
        id: orders.at(-1)?.id + 1 || 1,
        userId: +userId,
        productId,
        count,
      };

      findedUser.orders.push({
        id: orders.at(-1)?.id + 1 || 1,
        productId,
        count,
      });

      orders.push(newOrder);

      if (writeFile('orders.json', orders) && writeFile('users.json', users)) {
        succesfullFunction(res, 201, newOrder, 'json');
        return;
      }
    } catch (err) {
      res.status(err.code);
      res.send();
    }
  });

  // if (req.method === 'PATCH' && req.url.split('/')[1] === 'orders') {
  //   try {
  //     const orders = readFile('orders.json');
  //     const id = req.url.split('/')[2];
  //     const findedOrder = orders.find((order) => order.id === +id);

  //     if (findedOrder) {
  //       req.on('data', (body) => {
  //         const { productId, count } = JSON.parse(body);

  //         if (!id || !count || !productId) {
  //           errorFunction(res, 400, 'json', 'Bad Request');
  //           return;
  //         }

  //         findedOrder.productId = productId ? productId : findedOrder.productId;
  //         findedOrder.count = count ? count : findedOrder.count;

  //         if (writeFile('orders.json', orders)) {
  //           succesfullFunction(res, 200, findedOrder, 'json');
  //         }
  //       });
  //     } else {
  //       errorFunction(res, 404, 'json', 'Not Found');
  //     }
  //   } catch (err) {
  //     res.status(err.code);
  //     res.send(err.message);
  //   }
  // }
};
