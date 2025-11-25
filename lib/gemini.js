export async function generateAnswer({ prompt, grade, subject }) {
  const API_KEY = process.env.NEXT_GEMINI_API_KEY;
  const endpoint = 'https://api.generativeai.googleapis.com/v1/models/gemini-2.0-flash:generate';

  const systemInstruction = `You are a helpful homework assistant. Answer very short, to the point, grade ${grade || 'unspecified'}.`;

  const body = {
    prompt: `${systemInstruction}\nSubject: ${subject}\nQuestion: ${prompt}\nAnswer:`,
    maxOutputTokens: 200
  };

  const r = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify(body)
  });

  const json = await r.json();
  let answer = '';
  if (json?.candidates?.[0]?.content) answer = json.candidates[0].content;
  else if (json?.output?.[0]?.content) answer = json.output[0].content;
  else if (json?.text) answer = json.text;
  else answer = 'No answer found.';

  return answer.trim().slice(0, 1000);
}
