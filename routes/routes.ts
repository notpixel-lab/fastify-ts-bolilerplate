// Register routes using the custom Router

export const setTestRoutes = (router: any) => {
  router.get("/news", (req, res) => {
    message: ["news1", "news2"];
  });
  router.get("/news/:id", (req, res) => {
    message: `news${req.params.id}`;
  });
  router.get("/hello", async (req, res) => {
    return { message: "Hello from custom Router and Fastify!" };
  });

  //// router.get(/^\/hello(?:\/?)$/,

  router.get("/goodbye", async (req, res) => {
    return { message: "Goodbye from custom Router and Fastify!" };
  });
};

// export const routesPlugin = async (fastify, opts) => {
//   fastify.addHook("preHandler", async (req, res) => {
//     //do something on api routes
//     if (res.sent) return; //stop on error (like user authentication)
//   });
//   fastify.all("*", (req, reply) => router.handleRequest(req, reply));
// };

export class NetlifyRouter {
  private routes: {
    [method: string]: { [path: string]: (req: any, res: any) => any };
  } = {};

  public get = (path: string, handler: (req: any, res: any) => any) => {
    this.addRoute("GET", path, handler);
  };

  public post = (path: string, handler: (req: any, res: any) => any) => {
    this.addRoute("POST", path, handler);
  };

  // Add other HTTP methods as needed

  private addRoute(
    method: string,
    path: string,
    handler: (req: any, res: any) => any
  ) {
    if (!this.routes[method]) {
      this.routes[method] = {};
    }
    this.routes[method][path] = handler;
  }

  public buildHandler = () => {
    return async (event, context) => {
      try {
        const { httpMethod, path } = event;
        const readyPath = path.replace("/.netlify/functions/hello", "");
        const handler =
          this.routes[httpMethod] && this.routes[httpMethod][readyPath];

        if (handler) {
          const response = await handler(event, context);

          return {
            statusCode: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers":
                "Origin, X-Requested-With, Content-Type, Accept",
            },
            body: JSON.stringify(response),
          };
        } else {
          return {
            statusCode: 404,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              error: "Not Found " + " " + readyPath,
            }),
          };
        }
      } catch (error) {
        console.error("Error:", error);
        return {
          statusCode: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ error: "Internal Server Error" }),
        };
      }
    };
  };
}
