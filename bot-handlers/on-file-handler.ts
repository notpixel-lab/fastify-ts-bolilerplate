import { TranscribeParams } from "assemblyai";
import path from "node:path";
import { aiClients } from "../services/ai-clients.js";
import { InputFile } from "grammy";

import { Context } from "grammy";

export default async function onFileHandler(ctx: Context) {
  const file = await ctx.getFile();
  //
  const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
  const fileExtension = path.extname(file.file_path ?? "").toLowerCase();

  if ([".ogg", ".mp3", ".wav", ".flac", ".oga"].includes(fileExtension)) {
    ctx.reply("Audio file received!");
    const audioFilePath = "answer.ogg";

    var audio = await processAudio(fileUrl, audioFilePath);
    if (audio) {
      const audioBuffer = new Uint8Array(await audio.arrayBuffer());
      ctx.replyWithAudio(new InputFile(audioBuffer));
    }
    // ctx.reply(result ?? "No transcription result available.");

    // ctx.replyWithAudio(new InputFile(audioFilePath));
  } else {
    ctx.reply("This is not an audio file.");
  }
}

//Assemby Transcribe Audio
async function processAudio(audioFilePath: string, localPath: string) {
  const params: TranscribeParams = {
    audio: audioFilePath,
    language_code: "pl",
  };

  const transcript = await aiClients.assemblyAI.transcripts.transcribe(params);
  if (transcript.status === "error") {
    console.error(`Transcription failed: ${transcript.error}`);
    process.exit(1);
  }
  console.log(transcript.text);

  if (transcript.text) {
    let audio: Blob = await aiClients.textToSpeechEdge(transcript.text);

    return audio;
  } else {
    console.error("Transcription text is null or undefined.");
  }
}
