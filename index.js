import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

const PORT = 3000;

// Helper function
const tmdbFetch = async (endpoint, params = {}) => {
  const baseUrl = process.env.TMDB_BASE_URL.replace(/\/$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const url = new URL(`${baseUrl}${cleanEndpoint}`);

  const searchParams = new URLSearchParams({
    api_key: process.env.TMDB_API_KEY,
    language: 'vi-VN',
    ...params,
  });
  url.search = searchParams.toString();

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      console.error(`TMDB API Error: ${res.status} ${res.statusText} for ${endpoint}`);
      throw new Error(`Failed to fetch data from TMDB`);
    }
    return res.json();
  } catch (err) {
    console.error(`Fetch Error for ${endpoint}:`, err.message);
    throw err; // Ném lỗi gốc để route handler xử lý
  }
};

// Trending
app.get('/api/trending', async (req, res) => {
  try {
    const data = await tmdbFetch('/trending/all/day');
    res.json(data);
  } catch (err) {
    console.error('API Trending Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Popular
app.get('/api/popular', async (req, res) => {
  try {
    const data = await tmdbFetch('/movie/popular');
    res.json(data);
  } catch (err) {
    console.error('API Popular Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// By Genre
app.get('/api/genre/:id', async (req, res) => {
  try {
    const data = await tmdbFetch('/discover/movie', { with_genres: req.params.id });
    res.json(data);
  } catch (err) {
    console.error('API Genre Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// By Region/Language
app.get('/api/region/:lang', async (req, res) => {
  try {
    const data = await tmdbFetch('/discover/movie', { with_original_language: req.params.lang });
    res.json(data);
  } catch (err) {
    console.error('API Region Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Anime
app.get('/api/anime', async (req, res) => {
  try {
    const data = await tmdbFetch('/discover/movie', {
      with_genres: 16,
      with_keywords: '210024|222243',
    });
    res.json(data);
  } catch (err) {
    console.error('API Anime Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Featured
app.get('/api/featured', async (req, res) => {
  try {
    const data = await tmdbFetch('/discover/movie', {
      sort_by: 'popularity.desc',
      'vote_average.gte': 7.5,
      'vote_count.gte': 500,
      page: 1,
    });
    res.json(data);
  } catch (err) {
    console.error('API Featured Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Upcoming
app.get('/api/upcoming', async (req, res) => {
  try {
    const data = await tmdbFetch('/movie/upcoming');
    res.json(data);
  } catch (err) {
    console.error('API Upcoming Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Chạy server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
