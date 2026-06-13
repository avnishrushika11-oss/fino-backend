try {
  const parsed = JSON.parse(data);
  if (parsed.error) {
    res.status(500).json({ reply: 'Claude error: ' + parsed.error.message });
  } else {
    res.json({ reply: parsed.content[0].text });
  }
} catch(e) {
  res.status(500).json({ reply: 'Raw: ' + data });
}
