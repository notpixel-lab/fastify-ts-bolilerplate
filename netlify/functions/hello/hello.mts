// // import { Context, HandlerEvent } from "@netlify/functions";

// // export default async (event: HandlerEvent, context: Context) => {
// //   return Response.json({ mesage: "hello from serverless function!" });
// // };
// import { Context } from "@netlify/functions";
// import { fastify as buildFastify } from "fastify";
// const fastify = buildFastify({ logger: true });
// import cors from "@fastify/cors";

// // Register CORS
// fastify.register(cors, {
//   origin: true,
// });

// fastify.get("/", async (request, reply) => {
//   return { hello: "world" };
// });
// // fastify.all("*", async (request, reply) => {
// //   return { hello: "not found" };
// // });
// fastify.get("/users", async (request, reply) => {
//   return { users: ["John", "Jane", "Bob"] };
// });

// fastify.post("/echo", async (request, reply) => {
//   return { body: request.body };
// });

// export const handler = async (event, context) => {
//   try {
//     const response = await fastify.inject({
//       method: event.httpMethod,
//       url: event.path, //event.path.replace("/.netlify/functions/api", "")
//       query: event.queryStringParameters,
//       payload: event.body,
//       headers: event.headers,
//     });

//     return {
//       statusCode: response.statusCode,
//       headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Headers":
//           "Origin, X-Requested-With, Content-Type, Accept",
//       },
//       body: response.payload,
//     };
//   } catch (error) {
//     console.error("Error:", error);
//     return {
//       statusCode: 500,
//       headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "*",
//       },
//       body: JSON.stringify({ error: "Internal Server Error" }),
//     };
//   }
// };

export default async (event, context) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    };

    // Handle OPTIONS request for CORS
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 204,
        headers,
      };
    }

    if (event.path === "/.netlify/functions/hello/") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          users: [
            { id: 1, name: "John Doe" },
            { id: 2, name: "Jane Smith" },
          ],
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Hello from Netlify Functions!",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
    };
  }
};
