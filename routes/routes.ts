import Router from "./router";

export const router = new Router();

// Register routes using the custom Router
router.get("/hello", async (req, res) => {
  return { message: "Hello from custom Router and Fastify!" };
});

router.get("/goodbye", async (req, res) => {
  return { message: "Goodbye from custom Router and Fastify!" };
});
