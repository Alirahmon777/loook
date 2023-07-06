import { users } from './main.js';
import { api } from './utils/api.js';
const customerList = document.querySelector('.customers-list');
const clientId = document.querySelector('#clientId');
const userHeader = document.querySelector('#userHeader');

const getActiveUser = async () => {
  const { activeUserId, activeUserName } = await JSON.parse(
    localStorage.getItem('activeUser')
  );
  if (!activeUserId) return;
  const customerItem = document.querySelectorAll('.customer-item');
  customerItem.forEach((el) => el.classList.remove('active-user'));
  customerItem.forEach((el) => {
    if (el.dataset.id == activeUserId) el.classList.add('active-user');
  });
  clientId.textContent = activeUserId || '';
  clientId.style.color = 'darkred';
  userHeader.textContent = activeUserName || '';

  const orderUser = users.find((user) => user.id == activeUserId);

  renderOrder(orderUser.orders);
};

export function renderUser(data) {
  getActiveUser();

  data.forEach((element) => {
    const { id, name, phone } = element;
    const newItem = document.createElement('li');
    newItem.className = 'customer-item';

    newItem.id = 'customers-item';
    newItem.dataset.id = id;

    newItem.innerHTML =
      `<div class="customer-box flex items-center justify-between mb-2">
         <span class='customer-name pointer-events-none'>${name}</span>
         <div class="flex gap-4">
          <button class="button" id="edit-user-btn" data-id=${id}>
            <img src="./assets/svg/edit-icon.svg" alt="edit icon"/> 
          </button>
          <button class="button" id="delete-user-btn" data-id=${id} data-name=${name}>
            <img src="./assets/svg/delete-icon.svg" alt="delete icon"/> 
          </button>
         </div>
       </div>
       <a class='customer-phone' href='tel:${phone}'>
              ${phone.slice(0, 4)} (${phone.slice(4, 6)}) ${phone.slice(
        6,
        9
      )}-${phone.slice(9, 11)}-${phone.slice(11, 13)}
        </a>
      `.trim();

    newItem.addEventListener('click', () => {
      localStorage.setItem(
        'activeUser',
        JSON.stringify({
          activeUserId: id,
          activeUserName: name,
        })
      );
      getActiveUser();
    });

    customerList.append(newItem);
  });

  const deleteBtn = document.querySelectorAll('#delete-user-btn');
  const editBtn = document.querySelectorAll('#edit-user-btn');

  deleteBtn.forEach(async (el) => {
    el.addEventListener('click', () => {
      const result = confirm(`Remove ${el.dataset.name} from user list?`);

      if (result) {
        api()
          .delete(`/users/${el.dataset.id}`)
          .then((res) => {
            return res.data;
          });
      }
    });

    const usernameInput = document.querySelector('#usernameInput');
    const telephoneInput = document.querySelector('#telephoneInput');
    editBtn.forEach((el) => {
      el.addEventListener('click', () => {
        if (!usernameInput.value && !telephoneInput.value) {
          return;
        }
        api()
          .put(`/users/${+el.dataset.id}`, {
            name: usernameInput.value,
            phone: telephoneInput.value,
          })
          .then((res) => {
            console.log(res);
          });
      });
    });
  })();
}

export async function renderOrder(data) {
  const tabsBody = document.querySelector('#tabination-body');
  tabsBody.textContent = '';
  let products = [];

  await api()
    .get(`/products`)
    .then((res) => {
      products = res.data;
    });

  data?.forEach((order) => {
    const li = document.createElement('li');
    li.className = 'order-item';
    const product = products.find((product) => product.id == order.productId);

    li.innerHTML += `<img src=${product.image} id="order-image" />
      <div>
        <span class="order-name">${product.productName}</span>
        <span class="order-count">${order.count}</span>
      </div>`;

    tabsBody.appendChild(li);
  });
}

export function renderProduct(data) {
  const foodsSelect = document.querySelector('#foodsSelect');
  foodsSelect.textContent = '';

  foodsSelect.innerHTML = `<option value="" hidden>Choose...</option>`;
  data.forEach((food) => {
    foodsSelect.innerHTML += `<option value="${food.id}">${food.productName}</option>`;
  });

  foodsSelect.addEventListener('change', (e) => {
    const foodsForm = document.querySelector('#foodsForm');
    const clientId = document.querySelector('#clientId');
    const foodsCount = document.querySelector('#foodsCount');
    foodsForm.addEventListener('submit', (evt) => {
      evt.preventDefault();

      console.log(+clientId.textContent);

      if (!clientId.textContent || clientId.textContent == 0) {
        clientId.textContent = 'select a client!';
        clientId.style.color = 'red';
        return;
      }

      api().post(`/orders/${+clientId.textContent}`, {
        productId: +e.target.value,
        count: +foodsCount.value,
      });

      evt.target.reset();
    });

    console.log(e.target.value);
  });

  // const tabs = document.querySelector('#tabination');

  // let dupChars = data.filter((element, index) => {
  //   return data.indexOf(element) !== index;
  // });

  // console.log(dupChars);

  // data.forEach((element) => {
  //   categoryArr.push(element.category);
  // });

  // categoryArr = new Set(categoryArr);

  // categoryArr.forEach((el) => {
  //   tabs.innerHTML += `<button
  //     type="button"
  //     class="${
  //       el == 'drinks' ? 'active' : ''
  //     } hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600"
  //     id="tabs-with-icons-item-${el}"
  //     data-hs-tab='#tabs-with-icons-${el}'
  //     aria-controls="tabs-with-icons-${el}"
  //     role="tab"
  //   >
  //     ${el}
  //   </button>`;
  // });
}

// export function renderTabBody(data) {
//   const tabsBody = document.querySelector('#tabination-body');
//   data.forEach((element) => {
//     tabsBody.innerHTML += `
//     <li class="order-item" id="tabs-with-icons-${element.category}"
//       role="tabpanel"
//       class="${element.category == 'drinks' ? 'flex' : 'hidden'} order-item"
//       aria-labelledby="tabs-with-icons-item-${element.category}">
//       <img src="" alt="cola"/>
//       <div>
//         <span class="order-name">${element.productName}</span>
//         <span class="order-count"></span>
//       </div>
//     </li>`;
//   });
// }
