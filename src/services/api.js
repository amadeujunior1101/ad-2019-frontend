import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL || 'http://192.168.1.8:3333',
});

export default api;
