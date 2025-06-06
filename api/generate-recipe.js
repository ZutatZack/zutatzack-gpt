export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const zutaten = req.body.zutaten;

  if (!zutaten || zutaten.trim() === "") {
    return res.status(400).json({ error: "Keine Zutaten angegeben." });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Gib mir ein schnelles, kreatives Rezept mit diesen Zutaten: ${zutaten}. Bitte in einem Satz + Aha-Fact, z. B. kultureller Ursprung oder Nährwert.`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await openaiRes.json();

    if (!data.choices || data.choices.length === 0) {
      return res.status(500).json({ error: "GPT returned no choices" });
    }

    res.status(200).json({ recipe: data.choices[0].message.content });
  } catch (error) {
    console.error("GPT API error:", error);
    res.status(500).json({ error: "No response from GPT" });
  }
}


