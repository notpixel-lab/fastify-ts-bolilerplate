// Import the framework and instantiate it
import {
  FastifyServerOptions,
  fastify as buildFastify,
  FastifyInstance,
} from "fastify";
import tgBot from "./bot";
import { routesPlugin, setTestRoutes } from "./routes/routes";

export class FastifyServer {
  private static instance: FastifyServer;
  public fastify: FastifyInstance;

  private constructor() {
    const options: FastifyServerOptions = {
      logger: {
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true, // Enable colorful logs in the console
          },
        },
      },
    };

    this.fastify = buildFastify(options);
    this.setupRoutes();
  }

  public static getInstance(): FastifyServer {
    if (!FastifyServer.instance) {
      FastifyServer.instance = new FastifyServer();
    }
    return FastifyServer.instance;
  }

  private setupRoutes() {
    this.fastify.get("/", async (request, reply) => {
      request.log.info(request);
      return { hello: "world " };
    });

    setTestRoutes(this.fastify);
    // this.fastify.register(routesPlugin);

    // this.fastify.register(router.handleRequest);
    // this.fastify.all("*", (req, reply) => router.handleRequest(req, reply));
  }

  public async start() {
    try {
      // Async exec bot.start() before fastify.listen()
      if (this.fastify.server.listening || tgBot.isRunning()) {
        console.log("App is already running");
        return;
      }
      tgBot.start();

      if (process.env.RENDER) {
        console.log("Running on Render");
        console.log("Environment:", process.env.RENDER_ENV); // Output: production, staging, etc.
        await this.fastify.listen({ port: 3001, host: "0.0.0.0" }); // Listen on all interfaces});
        console.log("Server is running on port 3001");
      } else {
        console.log("Not running on Render");
        await this.fastify.listen({ port: 3001 }); // Listen on all interfaces});
        console.log("Server is running on port 3001");
      }
    } catch (err) {
      this.fastify.log.error(err);
      process.exit(1);
    }
  }
}

// Instantiate and start the server using the singleton instance
const server = FastifyServer.getInstance();

server.start();
