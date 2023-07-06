import axios from 'https://cdn.jsdelivr.net/npm/axios@1.4.0/+esm';

export const api = () =>
  axios.create({
    baseURL: 'http://localhost:3000',
  });
