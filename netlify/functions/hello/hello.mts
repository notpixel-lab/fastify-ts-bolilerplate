import { Context, HandlerEvent } from "@netlify/functions";

export default async (event: HandlerEvent, context: Context) => {
  return Response.json({ mesage: "hello from serverless function!" });
};
