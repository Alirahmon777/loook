import { readFile, writeFile } from '../filesystem.js';
import {
  checkIfUserExist,
  errorFunction,
  succesfullFunction,
  validatePhoneNumber,
} from '../helpers.js';

export const users = (app) => {
  app.get('/users', (req, res) => {
    try {
      const users = readFile('users.json');

      succesfullFunction(res, 200, users, 'json');
    } catch (err) {
      res.status(err.code);
      res.send();
    }
  });

  app.get('/users/:id', (req, res) => {
    try {
      const id = req.params.id;
      const users = readFile('users.json');
      const user = users.find((user) => user.id == id);
      if (user) {
        succesfullFunction(res, 200, user, 'json');
      } else {
        errorFunction(res, 404, 'json', 'User not found');
      }
      res.send(user);
    } catch (err) {
      console.log(err);
      res.status(err.code);
      res.send();
    }
  });

  app.post('/users', (req, res) => {
    try {
      const body = req.body;
      const users = readFile('users.json');
      const { name, phone } = body;

      if (Object.keys(body).length > 2 || !name || !phone || name.length < 3) {
        errorFunction(res, 400, 'json', 'Bad Request');
        return;
      }

      if (checkIfUserExist(phone)) {
        errorFunction(res, 400, 'json', 'User already exists');
        return;
      }

      if (!validatePhoneNumber(phone)) {
        errorFunction(
          res,
          400,
          'json',
          phone.includes('+')
            ? 'please delete + and try again'
            : 'the phone number is in the wrong format'
        );
        return;
      }

      const newUser = {
        id: users.at(-1)?.id + 1 || 1,
        name,
        phone: '+' + phone,
        orders: [],
      };

      users.push(newUser);

      if (writeFile('users.json', users)) {
        succesfullFunction(res, 201, users, 'json');
      }
    } catch (err) {
      res.status(err.code);
      res.send();
    }
  });

  app.delete('/users/:id', (req, res) => {
    try {
      const users = readFile('users.json');
      const id = req.params.id;
      const sortedUsers = users.filter((user) => user.id !== +id);

      if (writeFile('users.json', sortedUsers)) {
        succesfullFunction(res, 204, null, 'json');
      }
    } catch (err) {
      res.status(err.code);
      res.send();
    }
  });

  app.put('/users/:id', (req, res) => {
    try {
      const users = readFile('users.json');
      const id = req.params.id;
      const user = users.find((user) => user.id === +id);

      if (user) {
        const body = req.body;
        const { name, phone } = body;
        console.log(phone);
        if (name || phone) {
          user.name = name ? name : user.name;
          user.phone = phone ? '+' + phone : user.phone;

          if (writeFile('users.json', users)) {
            succesfullFunction(res, 200, user, 'json');
            return;
          }
          return;
        }
        errorFunction(res, 400, 'json', 'Bad Request');
      } else {
        errorFunction(res, 404, 'json', 'Not Found');
      }
    } catch (err) {
      res.status(err.code);
      res.send(err.message);
    }
  });
};
