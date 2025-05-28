<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ZutatZack – Mit KI kochen!</title>
  <style>
    body {
      font-family: sans-serif;
      background: #fffbe6;
      padding: 2rem;
      color: #333;
    }

    .recipe {
      margin-top: 2rem;
      border: 1px dashed #ccc;
      padding: 1rem;
      background: #fff;
    }

    input {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
      margin-bottom: 1rem;
      box-sizing: border-box;
    }

    button {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
      background: #eee;
      border: 1px solid #ccc;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>ZutatZack – Mit KI kochen!</h1>
  <p>Gib 2–3 Zutaten ein:</p>
  <input id="zutaten" type="text" placeholder="z. B. Reis, Tomate, Zimt" />
  <button onclick="sendeAnfrage()">Zack – Rezept her!</button>
  <div id="rezept" class="recipe" style="display: none;"></div>

  <script>
    async function sendeAnfrage() {
      const zutaten = document.getElementById('zutaten').value;

      const rezeptBox = document.getElementById('rezept');
      rezeptBox.style.display = 'block';
      rezeptBox.innerText = 'Bitte warten …';

      try {
        const response = await fetch('/api/generate-recipe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ zutaten })
        });

        const data = await response.json();

        if (data.recipe) {
          rezeptBox.innerText = data.recipe;
        } else {
          rezeptBox.innerText = 'Fehler: ' + (data.error || 'Keine Antwort erhalten');
        }
      } catch (error) {
        rezeptBox.innerText = 'Fehler beim Abrufen: ' + error.message;
      }
    }
  </script>
</body>
</html>


