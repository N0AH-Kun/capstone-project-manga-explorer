const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { pageTitle: 'Manga Explorer' });
});

app.get('/api/search', async (req, res) => {
  const { title } = req.query;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const response = await axios.get('https://api.mangadex.org/manga', {
      params: {
        title,
        limit: 5,
        includes: ['cover_art'],
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch manga' });
  }
});

app.get('/api/chapters', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Manga ID is required' });

  try {
    const response = await axios.get('https://api.mangadex.org/chapter', {
      params: {
        manga: id,
        translatedLanguage: ['en'],
        order: { chapter: 'asc' },
        limit: 10,
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});