export default async function handler(req, res) {
  const { ingredients } = req.body;

  if (!ingredients) {
    return res.status(400).json({ message: 'No ingredients provided' });
  }

  const prompt = `Erstelle ein einfaches, gesundes Rezept mit diesen Zutaten: ${ingredients}. 
Füge eine kurze Aha-Info aus Omas Küche oder einer anderen Kultur hinzu.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearersk-proj-OuMnmarcQwbRbVGZo7NCJC8gFR9jhAByqRrZnO8P80Wlr2Sn-JPlHyBPianBdW8rWvXqAjG2TZT3BlbkFJFcvWDpK32c23dVpVPXbQXsfKZqkscKsSBP6_XBkEg07_lNS4IaDC7I-1PrwL1eRL1NtBSGc5sA
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
    console.error("GPT API error:", error); // ← wichtig für Debugging in Vercel Logs
    res.status(500).json({ message: 'No response from GPT' });
  }
}

