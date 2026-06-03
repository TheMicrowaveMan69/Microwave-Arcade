import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// API routes FIRST
// Helper to proxy requests to target domain
const handleProxy = async (cleanPath: string | string[], req: express.Request, res: express.Response) => {
  const pathStr = Array.isArray(cleanPath) ? cleanPath.join('/') : (cleanPath || '');
  const finalPath = pathStr.replace(/^\/+/, '');
  const targetUrl = `https://securly.com.endue.gleeze.com/${finalPath}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': req.headers['accept'] || '*/*',
        'Accept-Language': req.headers['accept-language'] || '',
        'Referer': 'https://securly.com.endue.gleeze.com/'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).send('Not Found via Proxy');
      }
      return res.status(response.status).send(`Proxy error: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('content-type', contentType);
    }

    const cacheControl = response.headers.get('cache-control');
    if (cacheControl) {
      res.setHeader('cache-control', cacheControl);
    }

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error: any) {
    console.error(`Proxy failure for path: ${finalPath}`, error);
    res.status(500).send(`Internal Proxy Error: ${error.message}`);
  }
};

// Route for /api/proxy/*
app.get('/api/proxy/*path', async (req, res) => {
  await handleProxy(req.params.path, req, res);
});

// Route for root-relative filestorage/* requests
app.get('/filestorage/*path', async (req, res) => {
  const parts = Array.isArray(req.params.path) ? req.params.path : [req.params.path];
  await handleProxy(['filestorage', ...parts], req, res);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Vite middleware for development / Static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
