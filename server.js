const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/gpt4o-latest', async (req, res) => {
  const { ask = '', uid = '' } = req.query;

  if (!ask || !uid) {
    return res.status(400).json({ error: 'Missing ask or uid parameter.' });
  }

  try {
    const zetsu = await axios.get(`https://api.zetsu.xyz/api/chatgpt-4o-latest?uid=${uid}&prompt=${encodeURIComponent(ask)}`);

    res.json({
      author: 'Norch',
      response: zetsu.data?.response || 'No response.',
    });

  } catch (err) {
    console.error('❌ Error fetching from Zetsu:', err.message);
    res.status(500).json({ error: 'Failed to contact GPT.' });
  }
});

app.get('/', (req, res) => {
  res.send('🤖 NorchGPT API is alive!');
});

app.listen(PORT, () => {
  console.log(`🚀 NorchGPT running on http://localhost:${PORT}`);
});
