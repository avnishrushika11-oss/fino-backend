const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', (req, res) => {
  const { message, userContext } = req.body;

  const payload = JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system: `You are FINO AI, a Gen Z personal finance advisor for Indians. User context: ${JSON.stringify(userContext || {})}. Be short, practical, friendly. Max 3 sentences. Use ₹ and Indian context.`,
    messages: [{ role: 'user', content: message }]
  });

  const options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const apiReq = https.request(options, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        res.json({ reply: parsed.content[0].text });
      } catch(e) {
        res.status(500).json({ reply: 'Error parsing response' });
      }
    });
  });

  apiReq.on('error', (e) => {
    res.status(500).json({ reply: 'Request failed: ' + e.message });
  });

  apiReq.write(payload);
  apiReq.end();
});

app.get('/', (req, res) => res.send('FINO backend is running!'));

app.listen(3000, () => console.log('FINO backend running'));
