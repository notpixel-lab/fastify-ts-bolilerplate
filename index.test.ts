// import { Bot } from "grammy";
import { Bot } from "grammy";
import bot, { MyContext } from "./bot.js";
import { FastifyServer } from "./index.js"; // Adjust the import path as necessary
import { FastifyInstance } from "fastify";
import { vi, describe, test, expect, beforeAll } from "vitest";

describe("FastifyServer", () => {
  let server: FastifyServer;
  let tgBot: Bot<MyContext>;

  beforeAll(() => {
    server = FastifyServer.getInstance();
    tgBot = bot;
  });

  test("should return the same instance (singleton)", () => {
    const anotherServer = FastifyServer.getInstance();
    expect(server).toBe(anotherServer);
  });

  test("should setup routes correctly", async () => {
    const fastifyInstance: FastifyInstance = (server as any).fastify;
    const response = await fastifyInstance.inject({
      method: "GET",
      url: "/",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ hello: "world " });
  });

  test("should start the server with bot without errors", async () => {
    const fastifyInstance: FastifyInstance = (server as any).fastify;
    const startServerWithTgBotSpy = vi.spyOn(server, "start");
    // Mock the bot start method

    server.start();

    expect(startServerWithTgBotSpy).toHaveBeenCalled();
  });
});
