import Router from "./router";

export const router = new Router();

// Register routes using the custom Router
router.get("/hello", async (req, res) => {
  return { message: "Hello from custom Router and Fastify!" };
});

router.get("/goodbye", async (req, res) => {
  return { message: "Goodbye from custom Router and Fastify!" };
});

export const routesPlugin = async (fastify, opts) => {
  fastify.addHook("preHandler", async (req, res) => {
    //do something on api routes
    if (res.sent) return; //stop on error (like user authentication)
  });
  fastify.all("*", (req, reply) => router.handleRequest(req, reply));
};
