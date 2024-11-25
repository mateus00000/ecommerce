
import axios from 'axios';
import qs from 'qs';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export default api;
