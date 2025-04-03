import { Bot, Context } from "grammy";
// const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

export type MyContext = Context; //& EditOrReplyFlavor;
var bot: Bot<MyContext>;
bot = new Bot<MyContext>(process.env.TELEGRAM_BOT_TOKEN!);

// register the middleware
// bot.use(editOrReplyMiddleware());

import { getChatSession, history } from "./services/ai-clients.js";
import onFileHandler from "./bot-handlers/on-file-handler.js";
import { handleStartCommand } from "./bot-commands/handle-start.js";
// import {
//   EditOrReplyFlavor,
//   editOrReplyMiddleware,
//   getMessageInfo,
// } from "grammy-edit-or-reply/";
import fastify from "fastify";

bot.command("start", handleStartCommand);

//AI Gemini text response on text massage
bot.on("message:text", async (ctx) => {
  const userMessage = ctx.message.text;
  history.push({ role: "user", parts: [{ text: userMessage }] });

  // const spinner = ["|", "/", "-", "\\"]; // The spinner characters

  // let i = 0;
  // const interval = setInterval(async () => {
  //   // Update the message with spinner animation
  //   // await ctx.reply(`Processing ${spinner[i % spinner.length]}`);
  //   ctx.api.editMessageText(
  //     ctx.chat.id,
  //     ctx.message.message_id,
  //     `Processing ${spinner[i % spinner.length]}`
  //   );
  //   i++;
  // }, 500); // Update every 500ms (half a second)

  // // Simulate an action that takes time (e.g., data fetching)
  // setTimeout(async () => {
  //   // Stop the spinner and send a final message after 5 seconds
  //   clearInterval(interval);
  //   const OLD = getMessageInfo(ctx); // Replace 'any' with the correct type if known
  //   // await ctx.editOrReply(new MessageInfo, OLD);
  //   ctx.api.editMessageText(ctx.chat.id, ctx.message.message_id, "done");
  // }, 5000); // Stop spinner after 5 seconds

  const response = await getChatSession().sendMessage({ message: userMessage });
  ctx.reply(response.text ?? "Sorry, I couldn’t understand that. hhs");
});

bot.on(":file", onFileHandler);

//https://testy.propolski.com/en/grammar/
// Sample quiz questions
// const quizQuestions = [
//   {
//     question: 'What does "dzień dobry" mean in English? 444',
//     options: ["Good morning", "Good night", "Thank you", "Goodbye"],
//     correctIndex: 0,
//   },
//   {
//     question: 'What is the Polish word for "apple"?',
//     options: ["Jabłko", "Gruszka", "Pomidor", "Banana"],
//     correctIndex: 0,
//   },
//   {
//     question: 'How do you say "thank you" in Polish?',
//     options: ["Proszę", "Dziękuję", "Cześć", "Przepraszam"],
//     correctIndex: 1,
//   },
// ];

// // Handle the "Polish Quiz Game" button
// bot.callbackQuery("quiz_game", async (ctx) => {
//   await ctx.answerCallbackQuery(); // Acknowledge the button press

//   // Start the quiz with the first question
//   const firstQuestion = quizQuestions[0];
//   const quizKeyboard = new InlineKeyboard();
//   firstQuestion!.options.forEach((option, index) => {
//     quizKeyboard.text(option, `quiz_answer_0_${index}`).row();
//   });

//   ctx.reply(`🎮 Polish Quiz Game 🎮\n\n${firstQuestion.question}`, {
//     reply_markup: quizKeyboard,
//   });
// });

// // Handle quiz answers
// quizQuestions.forEach((question, questionIndex) => {
//   question.options.forEach((_, optionIndex) => {
//     bot.callbackQuery(
//       `quiz_answer_${questionIndex}_${optionIndex}`,
//       async (ctx) => {
//         await ctx.answerCallbackQuery(); // Acknowledge the button press

//         const isCorrect = optionIndex === question.correctIndex;
//         if (isCorrect) {
//           ctx.reply("✅ Correct! 🎉");
//         } else {
//           ctx.reply(
//             `❌ Incorrect. The correct answer is: ${
//               question.options[question.correctIndex]
//             }`
//           );
//         }

//         // Move to the next question if available
//         const nextQuestion = quizQuestions[questionIndex + 1];
//         if (nextQuestion) {
//           const nextQuizKeyboard = new InlineKeyboard();
//           nextQuestion.options.forEach((option, index) => {
//             nextQuizKeyboard
//               .text(option, `quiz_answer_${questionIndex + 1}_${index}`)
//               .row();
//           });

//           ctx.reply(`🎮 Next Question 🎮\n\n${nextQuestion.question}`, {
//             reply_markup: nextQuizKeyboard,
//           });
//         } else {
//           ctx.reply("🎉 You’ve completed the quiz! Great job! 🇵🇱");
//         }
//       }
//     );
//   });
// });

export default bot;
