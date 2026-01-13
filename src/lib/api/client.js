import axios from 'axios';
import { BASE_URL } from '../../config/config';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
  }
});

client.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    language: 'vi-VN'
  };
  return config;
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
