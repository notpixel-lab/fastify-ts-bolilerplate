import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

type Handler = (req: FastifyRequest, res: FastifyReply) => Promise<any>;

interface Route {
  path: string;
  handler: Handler;
}

class Router {
  public routes: { [key: string]: Route[] } = {};

  constructor() {
    this.routes = {};
  }

  // Register a route with a specific HTTP method and handler
  private register(method: string, path: string, handler: Handler): void {
    if (!this.routes[method]) {
      this.routes[method] = [];
    }
    this.routes[method].push({ path, handler });
  }

  // Create methods for all HTTP methods
  public get(path: string, handler: Handler): void {
    this.register("GET", path, handler);
  }

  public post(path: string, handler: Handler): void {
    this.register("POST", path, handler);
  }

  public put(path: string, handler: Handler): void {
    this.register("PUT", path, handler);
  }

  public delete(path: string, handler: Handler): void {
    this.register("DELETE", path, handler);
  }

  public patch(path: string, handler: Handler): void {
    this.register("PATCH", path, handler);
  }

  public head(path: string, handler: Handler): void {
    this.register("HEAD", path, handler);
  }

  public options(path: string, handler: Handler): void {
    this.register("OPTIONS", path, handler);
  }

  // Handle the incoming request and route it to the appropriate handler
  public async handleRequest(
    req: FastifyRequest,
    res: FastifyReply
  ): Promise<any> {
    const methodRoutes = this.routes[req.method || "GET"];
    if (methodRoutes) {
      for (const route of methodRoutes) {
        if (req.url === route.path) {
          try {
            const result = await route.handler(req, res);
            res.status(200).send(result); // Use Fastify methods
            return result;
          } catch (err) {
            console.error("Error in route handler:", err);
            res.status(500).send({ error: "Internal Server Error" }); // Use Fastify methods
            return;
          }
        } else {
          res.status(404).send({ error: "Not Found" });
        }
      }
    }
    // Use Fastify methods
  }
}

export default Router;
