import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://consulting-stage-api.onrender.com'
    : 'http://localhost:3334',
});