import { eventHandler, readBody } from "#imports";
import OpenAI from "openai";

// Initialize OpenAI with server-side API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default eventHandler(async (event) => {
  try {
    const { messages } = await readBody(event);
    
    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: { error: "Invalid request. Messages array is required." }
      };
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 1000
    });
    
    return {
      statusCode: 200,
      body: {
        message: response.choices[0].message.content,
        usage: response.usage
      }
    };
  } catch (error: any) {
    console.error("Error calling OpenAI:", error);
    
    return {
      statusCode: 500,
      body: { 
        error: "Error processing your request",
        message: error.message
      }
    };
  }
});