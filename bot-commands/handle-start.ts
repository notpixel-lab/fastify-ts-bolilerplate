import { Context, InlineKeyboard } from "grammy";

export const handleStartCommand = (ctx: Context) => {
  const mainMenu = new InlineKeyboard()
    .text("Authenticate with Diia 🇺🇦", "diia_auth")
    .row()
    .text("Start Learning Polish 🇵🇱", "start_learning")
    .row()
    .text("Help ❓", "help")
    .row()
    .text("About the Bot ℹ️", "about");

  ctx.reply(
    "Welcome to the Polish Learning Bot! 🇵🇱\n\nChoose an option below to get started:",
    {
      reply_markup: mainMenu,
    }
  );
};
