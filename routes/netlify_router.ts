const { IncomingMessage, ServerResponse } = require("http");

class NetlifyRouter {
  routes: {};
  // Store the routes for each HTTP method
  constructor() {
    this.routes = {};
  }

  // Register a route with a specific HTTP method and handler
  register(method, path, handler) {
    if (!this.routes[method]) {
      this.routes[method] = [];
    }
    this.routes[method].push({ path, handler });
  }

  // Create methods for all HTTP methods
  get(path, handler) {
    this.register("GET", path, handler);
  }

  post(path, handler) {
    this.register("POST", path, handler);
  }

  put(path, handler) {
    this.register("PUT", path, handler);
  }

  delete(path, handler) {
    this.register("DELETE", path, handler);
  }

  patch(path, handler) {
    this.register("PATCH", path, handler);
  }

  head(path, handler) {
    this.register("HEAD", path, handler);
  }

  options(path, handler) {
    this.register("OPTIONS", path, handler);
  }

  // Handle the incoming request and route it to the appropriate handler
  async handleRequest(event) {
    const { httpMethod, path, body, headers } = event;
    const methodRoutes = this.routes[httpMethod || "GET"];

    if (methodRoutes) {
      // Iterate over the routes for the method and find a match for the path
      for (const route of methodRoutes) {
        if (path === route.path) {
          try {
            const req = this.createRequest(event, body); // Mock the incoming request
            const res = this.createResponse(); // Mock the response
            const result = await route.handler(req, res); // Call the handler
            return result;
          } catch (err) {
            console.error("Error in route handler:", err);
            return {
              statusCode: 500,
              body: JSON.stringify({ error: "Internal Server Error" }),
            };
          }
        }
      }
    }
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Not Found" }),
    };
  }

  // Create a mock IncomingMessage from the Netlify event
  createRequest(event, body) {
    const req = new IncomingMessage(null);
    req.method = event.httpMethod;
    req.url = event.path;
    req.headers = event.headers;
    req.body = body;
    return req;
  }

  // Create a mock ServerResponse
  createResponse() {
    const res = new ServerResponse(null);
    res.statusCode = 200;
    res.setHeader = (name, value) => {};
    res.end = (body) => {
      return {
        statusCode: res.statusCode,
        body,
      };
    };
    return res;
  }
}

module.exports = NetlifyRouter;
