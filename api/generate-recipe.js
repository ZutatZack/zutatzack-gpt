export default async function handler(req, res) {
  const { ingredients } = req.body;

  if (!ingredients) {
    return res.status(400).json({ message: 'No ingredients provided' });
  }

  const prompt = `Erfinde ein gesundes, leckeres Rezept auf Basis dieser Zutaten: ${ingredients}. 
Wenn sie ungewöhnlich kombiniert sind, sei kreativ! Nenne das Rezept, beschreibe es in 2–3 Sätzen und gib zum Schluss eine kurze Aha-Info hinzu – z. B. aus Omas Küche oder einer Kulturtradition.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // <- genau so
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ message: 'GPT returned no choices' });
    }

    res.status(200).json({ recipe: data.choices[0].message.content });
  } catch (error) {
    console.error("GPT API error:", error);
    res.status(500).json({ message: 'No response from GPT' });
  }
}

