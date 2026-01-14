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
    const status = error?.response?.status;
    const data = error?.response?.data;
    console.error('API error:', {
      message: error.message,
      status,
      data
    });

    return {
      success: false,
      data: null,
      error: error.message || 'Unknown error',
      status,
      body: data
    };
  }
);

export default client;
