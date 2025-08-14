const API_KEY = "AIzaSyCrdmqHNN9-n80k8BQvsRZiJrRw4lSXr1M";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

export const callGemini = async (prompt, base64ImageData = null, jsonSchema = null) => {
  let parts = [{ text: prompt }];
  if (base64ImageData) {
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64ImageData } });
  }

  const payload = { contents: [{ role: "user", parts: parts }] };

  if (jsonSchema) {
    payload.generationConfig = {
      responseMimeType: "application/json",
      responseSchema: jsonSchema
    };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();

    if (result.candidates && result.candidates.length > 0) {
      const text = result.candidates[0].content.parts[0].text;
      if (jsonSchema) {
        return JSON.parse(text);
      }
      return { text: text };
    } else {
      throw new Error("No candidates returned from API.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
};