import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configuração do CORS (APENAS UMA VEZ, no início)
app.use(cors({
  origin: "https://seusite.com" // Substitua pelo domínio do seu front (Hostinger)
}));

app.use(express.json());

// Rota POST para o Trello
app.post("/api/trello", async (req, res) => {
  const { name, email, subject, message } = req.body;

  const cardName = `Contato: ${name}`;
  const cardDesc = `📧 Email: ${email}\n📝 Assunto: ${subject}\n\n💬 Mensagem:\n${message}`;

  const url = `https://api.trello.com/1/cards?idList=${process.env.TRELLO_LIST_ID}&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: cardName, desc: cardDesc })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da API do Trello:", data);
      return res.status(500).json({ error: "Erro ao criar card no Trello" });
    }

    res.status(200).json({ message: "Card criado com sucesso" });
  } catch (error) {
    console.error("Erro ao criar card:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Rota de teste (OPCIONAL)
app.get("/api/test", (req, res) => {
  res.status(200).json({ status: "Backend online!" });
});

// Exportação obrigatória para a Vercel
export default app;