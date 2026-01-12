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
  const url = new URL(`${process.env.TMDB_BASE_URL}${endpoint}`);
  url.search = new URLSearchParams({
    api_key: process.env.TMDB_API_KEY,
    language: 'vi-VN',
    ...params,
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return res.json();
};

// Trending
app.get('/api/trending', async (req, res) => {
  try {
    const data = await tmdbFetch('/trending/all/day');
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Popular
app.get('/api/popular', async (req, res) => {
  try {
    const data = await tmdbFetch('/movie/popular');
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// By Genre
app.get('/api/genre/:id', async (req, res) => {
  try {
    const data = await tmdbFetch('/discover/movie', { with_genres: req.params.id });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// By Region/Language
app.get('/api/region/:lang', async (req, res) => {
  try {
    const data = await tmdbFetch('/discover/movie', { with_original_language: req.params.lang });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Featured
app.get('/api/featured', async (req, res) => {
  try {
    const data = await tmdbFetch('/discover/movie', {
      sort_by: 'popularity.desc',
      vote_average_gte: 7.5,
      vote_count_gte: 500,
      page: 1,
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Upcoming
app.get('/api/upcoming', async (req, res) => {
  try {
    const data = await tmdbFetch('/movie/upcoming');
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Chạy server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
