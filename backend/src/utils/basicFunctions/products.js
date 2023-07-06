import { readFile, writeFile } from '../filesystem.js';
import {
  errorFunction,
  isValidProductBody,
  succesfullFunction,
} from '../helpers.js';

export const productFunction = (app) => {
  app.get('/products', (req, res) => {
    try {
      const products = readFile('products.json');
      succesfullFunction(res, 200, products, 'json');
    } catch (err) {
      res.status(err.code);
      res.send();
    }
  });

  app.get('/products/:id', (req, res) => {
    const products = readFile('products.json');
    const id = req.params.id;
    const product = products.find((p) => p.id == id);

    if (!product) {
      errorFunction(res, 404, 'json', 'Product not found');
    }

    succesfullFunction(res, 200, product, 'json');
  });

  app.post('/products', (req, res) => {
    try {
      const body = req.body;
      const { productName, count, price } = body;

      if (!isValidProductBody(body)) {
        errorFunction(res, 400, 'json', 'Bad Request');
        return;
      }

      const products = readFile('products.json');

      const newUser = {
        id: products.at(-1)?.id + 1 || 1,
        productName,
        count,
        price,
      };

      products.push(newUser);

      if (writeFile('products.json', products)) {
        succesfullFunction(res, 201, newUser, 'json');
      }
    } catch (err) {
      res.status(err.code);
      res.send();
    }
  });

  app.delete('/products/:id', (req, res) => {
    try {
      const products = readFile('products.json');
      const id = req.params.id;
      const sortedProducts = products.filter((product) => product.id != id);

      if (writeFile('products.json', sortedProducts)) {
        succesfullFunction(res, 204, null, 'json');
      }
    } catch (err) {
      res.status(err.code);
      res.send();
    }
  });
};
