export async function POST(req) {
  try {
    const { prompt, grade, subject } = await req.json();

    if (!process.env.NEXT_GEMINI_API_KEY) {
      return new Response(JSON.stringify({
        error: "API key missing in environment variables",
      }), { status: 500 });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        process.env.NEXT_GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Grade: ${grade}\nSubject: ${subject}\nQuestion: ${prompt}\nGive a short, meaningful, to-the-point answer.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const aiAnswer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI returned no answer.";

    return new Response(JSON.stringify({ answer: aiAnswer }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
