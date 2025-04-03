// Register routes using the custom Router

export const setTestRoutes = (router) => {
  router.get("/news", (req, res) => res.send(["news1", "news2"]));
  router.get("/news/:id", (req, res) => res.send(`news${req.params.id}`));
  router.get("/hello", async (req, res) => {
    return { message: "Hello from custom Router and Fastify!" };
  }); // router.get(/^\/hello(?:\/?)$/,

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
