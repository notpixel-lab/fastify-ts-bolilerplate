import { GoogleGenAI, type Content } from "@google/genai";
import { AssemblyAI } from "assemblyai";
import { synthesize } from "@echristian/edge-tts";

class AIClients {
  private static instance: AIClients;

  public googleGenAI: GoogleGenAI;
  public assemblyAI: AssemblyAI;

  // Chat history for AI
  public history: Content[] = [
    {
      role: "user",
      parts: [{ text: "I want to learn Polish. Let’s speak Polish together." }],
    },
  ];

  getChatSession = () => {
    return this.googleGenAI.chats.create({
      history: this.history,
      model: "gemini-2.0-flash",
      config: {
        temperature: 0.5,
        maxOutputTokens: 1024,
      },
    });
  };

  private constructor() {
    this.googleGenAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    this.assemblyAI = new AssemblyAI({
      apiKey: process.env.ASSEMBLYAI_API_KEY!,
    });
  }

  public static getInstance(): AIClients {
    if (!AIClients.instance) {
      AIClients.instance = new AIClients();
    }
    return AIClients.instance;
  }

  public async textToSpeechEdge(promptInPolish: string): Promise<Blob> {
    const aiResponse = await this.getChatSession().sendMessage({
      message: promptInPolish,
    });
    const { audio } = await textToSpeech({
      text: aiResponse.text ?? "",
      voice: "pl-PL-ZofiaNeural",
      language: "pl-PL",
    });

    return audio;

    // const audioFilePath = 'answer.ogg';
    //   await saveFileFromStream(audio.stream(), audioFilePath);
  }
}

export const aiClients = AIClients.getInstance();
export const textToSpeech = synthesize;
export const getChatSession = aiClients.getChatSession;
export const history = aiClients.history;
