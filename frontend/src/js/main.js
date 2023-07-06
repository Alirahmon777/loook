import { renderProduct, renderUser } from './render.js';

import { api } from './utils/api.js';
import { toaster } from './utils/toaster.js';
const userAdd = document.querySelector('#userAdd');
const usernameInput = document.querySelector('#usernameInput');
const telephoneInput = document.querySelector('#telephoneInput');

window.location.pathname == '/'
  ? window.location.replace('/frontend/src/index.html')
  : null;

export let users = [];

const getUsers = () => {
  api()
    .get('/users')
    .then((res) => {
      users = res.data;
      renderUser(users);
    })
    .catch((err) => {
      return err;
    });
};

getUsers();

const getCategories = () => {
  api()
    .get('/products')
    .then((res) => {
      renderProduct(res.data);
    })
    .catch((err) => {
      return err;
    });
};

getCategories();

// const getProducts = () => {
//   api()
//     .get('/products')
//     .then((res) => {
//       renderTabBody(res.data);
//     })
//     .catch((err) => {
//       return err;
//     });
// };

// getProducts();

userAdd.addEventListener('submit', (e) => {
  e.preventDefault();

  api()
    .post('/users', {
      name: usernameInput.value.trim(),
      phone: telephoneInput.value.trim(),
    })
    .then((res) => {
      users = res.data;
      toaster('success', 'users added successfully');
    })
    .catch((err) => {
      usernameInput.value = '';
      telephoneInput.value = err.response.data.error;
      telephoneInput.style.color = 'red';
      return err;
    });
});

telephoneInput.addEventListener('input', () => {
  telephoneInput.style.color = 'black';
});
