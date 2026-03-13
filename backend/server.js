require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const http = require('http');
const { Server } = require('socket.io');
const promClient = require('prom-client');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
connectDB();

app.locals.io = io;

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });
const httpDuration = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'HTTP request duration in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 500, 1000]
});
register.registerMetric(httpDuration);

app.use(cors());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use((req, res, next) => {
  const end = httpDuration.startTimer();
  res.on('finish', () => end({ method: req.method, route: req.path, status_code: String(res.statusCode) }));
  next();
});

// AES helper endpoint usage pattern (store encrypted sensitive snapshots when needed)
const AES_KEY = Buffer.from((process.env.AES_KEY || '12345678901234567890123456789012').slice(0, 32));
const AES_IV = Buffer.from((process.env.AES_IV || '1234567890123456').slice(0, 16));
app.locals.encryptSensitive = (plainText) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, AES_IV);
  return Buffer.concat([cipher.update(String(plainText), 'utf8'), cipher.final()]).toString('base64');
};

app.get('/health', (_req, res) => res.json({ status: 'ok', tlsRequired: true }));
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

io.on('connection', (socket) => {
  socket.emit('notification', { type: 'system', message: 'Connected to VyaparAI alerts' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend listening on ${PORT}`);
});
