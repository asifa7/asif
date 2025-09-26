import { GoogleGenAI } from "@google/genai";
import type { Session } from '../types';

const getAi = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set. Please refer to the project README for setup instructions.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const getExerciseTip = async (exerciseName: string): Promise<string> => {
  try {
    const ai = getAi();
    const prompt = `Provide a concise, actionable tip for performing the "${exerciseName}" exercise correctly. Focus on the most common mistake or the most important form cue. Maximum 2-3 sentences.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching exercise tip from Gemini API:", error);
    if (error.message.includes("API_KEY")) {
        return error.message;
    }
    return "Could not fetch tip. Please check your API key and network connection.";
  }
};

export const getWorkoutImprovementSuggestion = async (sessions: Session[], templateTitle: string): Promise<string> => {
    try {
        const ai = getAi();
        // Create a summarized history to send to the model
        const historySummary = sessions.map(s => ({
            date: s.date,
            totalVolume: s.totalVolume,
            exercises: s.exercises.map(ex => ({
                name: ex.name,
                sets: ex.sets.map(set => `Reps: ${set.reps}, Weight: ${set.weight}${s.unit}`).join('; ')
            }))
        })).slice(-5); // Send last 5 sessions to keep prompt concise

        const prompt = `
            Based on the following workout history for "${templateTitle}", provide a concise and actionable suggestion for improvement.
            Focus on potential plateaus (stagnant weight/reps) or opportunities for progressive overload.
            The user wants to know what to improve. Be specific but brief (3-4 sentences).

            Workout History (last ${historySummary.length} sessions):
            ${JSON.stringify(historySummary, null, 2)}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;

    } catch (error) {
        console.error("Error fetching workout suggestion from Gemini API:", error);
        if (error.message.includes("API_KEY")) {
            return error.message;
        }
        return "Could not fetch suggestion. Please check your API key and network connection.";
    }
};
