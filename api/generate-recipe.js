export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { ingredients } = req.body;

  if (!ingredients) {
    return res.status(400).json({ message: 'No ingredients provided' });
  }

  const prompt = `Erstelle ein einfaches, gesundes Rezept mit diesen Zutaten: ${ingredients}.
Füge eine kurze Aha-Info aus Omas Küche oder eine kulturelle Geschichte hinzu.`;

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

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ message: 'No response from GPT' });
    }

    res.status(200).json({ recipe: data.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
