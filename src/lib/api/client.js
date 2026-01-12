import axios from 'axios';
import { BASE_URL } from './config';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

client.interceptors.response.use(
  response => ({
    success: true,
    data: response.data,
    error: null
  }),
  error => {
    console.error('API error:', error.message);
    return {
      success: false,
      data: null,
      error: error.message || 'Unknown error'
    };
  }
);



export default client;
