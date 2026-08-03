import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Serve all static files from root directory
app.use(express.static(process.cwd()));

// Fallback to index.html for root or SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
