import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { fastifyWebsocket } from '@fastify/websocket';
import dotenv from 'dotenv';
import { connectDB } from '@/config/database';
import { registerRoutes } from '@/routes';
import { setupWebSocket } from '@/websocket';

// Load environment variables from root .env file
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

// Create Fastify instance
const app = fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

const setupApp = async () => {
  await registerPlugins();
  await registerRoutes(app);
  await setupWebSocket(app);
  await connectDB();
  return app;
};

// Register plugins
const registerPlugins = async () => {
  // Security
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  });

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.register(sensible);
  await app.register(fastifyWebsocket);

  // Swagger documentation
  if (process.env.NODE_ENV !== 'production') {
    const swaggerOptions = {
      openapi: {
        info: {
          title: 'ClipCraftr API',
          description: 'API documentation for ClipCraftr',
          version: '1.0.0',
        },
        externalDocs: {
          url: 'https://github.com/jondmarien/clipcraftr',
          description: 'GitHub repository',
        },
        servers: [
          {
            url: `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${process.env.API_HOST || 'localhost:4000'}`,
          },
        ],
        tags: [
          { name: 'clips', description: 'Clip related end-points' },
          { name: 'montages', description: 'Montage related end-points' },
          { name: 'auth', description: 'Authentication related end-points' },
        ],
      },
    };

    // Register Swagger with proper types
    await app.register(fastifySwagger, swaggerOptions);

    // Configure Swagger UI with proper typing
    const swaggerUiOptions = {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
      },
      staticCSP: true,
      transformStaticCSP: (header: string) => header,
    } as const;

    // Register Swagger UI with proper typing
    type SwaggerUiOptions = typeof swaggerUiOptions;
    await app.register<SwaggerUiOptions>(fastifySwaggerUi, swaggerUiOptions);
  }
};

// Start server
const start = async () => {
  try {
    // Register plugins
    await registerPlugins();

    // Register routes
    await registerRoutes(app);

    // Setup WebSocket
    await setupWebSocket(app);

    // Connect to database
    await connectDB();

    const port = Number(process.env.PORT) || 4000;
    const host = process.env.HOST || '0.0.0.0';

    await app.listen({ port, host });
    app.log.info(`Server is running on http://${host}:${port}`);
    if (process.env.NODE_ENV !== 'production') {
      app.log.info(`API documentation available at http://${host}:${port}/docs`);
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Handle shutdown
process.on('SIGINT', async () => {
  app.log.info('Shutting down server...');
  await app.close();
  process.exit(0);
});

// Start the application
if (require.main === module) {
  start();
}

export default setupApp;