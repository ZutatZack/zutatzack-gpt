export default async function handler(req, res) {
  const { ingredients } = req.body;

  if (!ingredients) {
    return res.status(400).json({ message: 'No ingredients provided' });
  }

  const prompt = `Erstelle ein kreatives, leckeres Rezept mit folgenden Zutaten: ${ingredients}.
Beschreibe es in 2–3 Sätzen.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!data || !data.choices || !data.choices[0]) {
      console.error("❌ GPT returned:", JSON.stringify(data, null, 2));
      return res.status(500).json({ message: 'GPT returned no choices' });
    }

    res.status(200).json({ recipe: data.choices[0].message.content });

  } catch (error) {
    console.error("🔥 Error calling OpenAI:", error);
    res.status(500).json({ message: 'No response from GPT' });
  }
}


