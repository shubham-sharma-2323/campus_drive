const express = require('express');
const axios = require('axios');
const app = express();
const port = 8000; // Change this port as needed

app.get('/numbers', async (req, res) => {
  try {
    const urls = req.query.url;
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: 'Invalid query parameter "url". Expected an array of URLs.' });
    }

    const results = await Promise.all(
      urls.map(async (url) => {
        try {
          const response = await axios.get(url);
          if (response.data && typeof response.data === 'number') {
            return response.data;
          } else {
            throw new Error(`Invalid response from URL: ${url}`);
          }
        } catch (error) {
          throw new Error(`Error fetching data from URL: ${url}`);
        }
      })
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
