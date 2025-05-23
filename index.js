import fetch from 'node-fetch';

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://glendacarvalho.com.br");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // resposta para preflight
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { name, email, subject, message } = req.body;

  const cardName = `Contato: ${name}`;
  const cardDesc = `📧 Email: ${email}\n📝 Assunto: ${subject}\n\n💬 Mensagem:\n${message}`;

  const url = `https://api.trello.com/1/cards?idList=${process.env.TRELLO_LIST_ID}&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: cardName, desc: cardDesc }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: "Erro no Trello", details: data });
    }

    return res.status(200).json({ message: "Card criado com sucesso!" });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno", details: error.message });
  }
}
