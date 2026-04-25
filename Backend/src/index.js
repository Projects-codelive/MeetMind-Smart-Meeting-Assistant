require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const { initializeSocket } = require('./websocket/socket');

const authRoutes = require('./routes/auth.routes');
const meetingRoutes = require('./routes/meeting.routes');
const aiRoutes = require('./routes/ai.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const integrationRoutes = require('./routes/integration.routes');
const notionRoutes = require('./notion/notion.routes');

const errorMiddleware = require('./middleware/error.middleware');
const { defaultLimiter } = require('./middleware/rateLimit.middleware');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(defaultLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/notion', notionRoutes);

app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDB();
    
    try {
      connectRedis();
    } catch (err) {
      logger.warn('Redis connection failed, continuing without Redis');
    }

    initializeSocket(server);

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();