import { readFile } from './filesystem.js';

export const errorFunction = (res, status, contentType, errorMessage) => {
  res.status(status);
  res.setHeader('Content-Type', `application/${contentType}`);
  res.write(JSON.stringify({ error: errorMessage }));
  res.send();
};

export const succesfullFunction = (
  res,
  status,
  content,
  contentType = 'text'
) => {
  res.status(status);
  res.setHeader('Content-Type', `application/${contentType}`);

  res.send(JSON.stringify(content, null, 2));
};

export function checkIfUserExist(phone) {
  const data = readFile('users.json');
  const user = data.find((person) => person.phone === `+${phone}`);

  return !!user;
}

export function validatePhoneNumber(phone) {
  const pattern = new RegExp(
    '^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$',
    'g'
  );
  return pattern.test(phone);
}

export function isValidProductBody(product) {
  if (
    Object.keys(product).length > 4 ||
    !product.name ||
    !product.count ||
    !product.price ||
    !product.image
  ) {
    return false;
  }

  if (product.count > 100 || product.count < 1) {
    return false;
  }

  if (product.price > 1_000_000 || product.price < 1000) {
    return false;
  }

  return true;
}
