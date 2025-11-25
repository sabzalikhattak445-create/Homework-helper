import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt, grade, subject } = await req.json();

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const API_KEY = process.env.NEXT_GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: 'Server misconfigured: NEXT_GEMINI_API_KEY not set' }, { status: 500 });
    }

    const systemInstruction = `You are a helpful homework assistant. Answer very short, to the point, and grade ${grade || 'unspecified'}.`;

    const body = {
      prompt: `${systemInstruction}\nSubject: ${subject || 'General'}\nQuestion: ${prompt}\nAnswer:`,
      maxOutputTokens: 200
    };

    const endpoint = 'https://api.generativeai.googleapis.com/v1/models/gemini-2.0-flash:generate';

    const r = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      const text = await r.text();
      return NextResponse.json({ error: 'AI service error', details: text }, { status: 502 });
    }

    const json = await r.json();

    let answer = '';
    if (json?.candidates?.[0]?.content) answer = json.candidates[0].content;
    else if (json?.output?.[0]?.content) answer = json.output[0].content;
    else if (json?.text) answer = json.text;
    else answer = 'No answer found.';

    answer = answer.trim().slice(0, 1000);

    return NextResponse.json({ answer });

  } catch (err) {
    console.error('Error generating AI:', err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
}
