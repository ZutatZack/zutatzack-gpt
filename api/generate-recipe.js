// Datei: /api/generate-recipe.js
export default async function handler(req, res) {
  const { ingredients } = req.body;

  const prompt = `Gib mir ein einfaches, schnelles Rezept mit diesen Zutaten: ${ingredients}.
Es soll möglichst gesund und alltagstauglich sein. Gib auch eine kurze Aha-Info dazu (z. B. aus Großmutters Küche oder etwas Kulturelles).`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  res.status(200).json({ recipe: data.choices[0].message.content });
}
