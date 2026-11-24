import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve(undefined);
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function attachResponseHelpers(res) {
  res.status = code => {
    res.statusCode = code;
    return res;
  };
  res.json = payload => {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.end(JSON.stringify(payload));
    return res;
  };
  return res;
}

function apiRoutesPlugin() {
  const mountApiMiddleware = middlewares => {
    middlewares.use(async (req, res, next) => {
      const pathname = (req.url || '').split('?')[0];
      if (pathname !== '/api/telegram-setup' && pathname !== '/api/telegram-webhook') {
        return next();
      }

      try {
        if (req.method === 'POST' && req.body === undefined) {
          req.body = await readJsonBody(req);
        }
        attachResponseHelpers(res);
        const mod = pathname === '/api/telegram-setup'
          ? await import('./api/telegram-setup.js')
          : await import('./api/telegram-webhook.js');
        await mod.default(req, res);
      } catch (error) {
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ error: error?.message || 'Internal server error' }));
        }
      }
    });
  };

  return {
    name: 'local-api-routes',
    configureServer(server) {
      mountApiMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      mountApiMiddleware(server.middlewares);
    }
  };
}

export default defineConfig({
  plugins: [react(), apiRoutesPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true
  },
  preview: {
    host: '0.0.0.0',
    port: 3000
  }
});
