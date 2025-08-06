const express = require("express");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Banco de dados
const dbFile = "./pagamentos.db";
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  db.run(\`
    CREATE TABLE IF NOT EXISTS pagamentos (
      id TEXT PRIMARY KEY,
      valor INTEGER,
      descricao TEXT,
      aprovadoEm TEXT,
      nome TEXT,
      email TEXT,
      cpf TEXT,
      telefone TEXT
    )
  \`);
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.post("/registrar-pagamento", (req, res) => {
  const { paymentId, valor, aprovadoEm, descricao, cliente } = req.body;

  db.run(\`
    INSERT OR IGNORE INTO pagamentos (id, valor, descricao, aprovadoEm, nome, email, cpf, telefone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  \`, [
    paymentId,
    valor,
    descricao,
    aprovadoEm,
    cliente?.name || "",
    cliente?.email || "",
    cliente?.cpf || "",
    cliente?.phone || ""
  ], (err) => {
    if (err) {
      console.error("Erro ao registrar:", err);
      return res.status(500).send("Erro ao salvar");
    }
    res.send("Registrado com sucesso!");
  });
});

app.get("/pagamentos", (req, res) => {
  db.all("SELECT * FROM pagamentos ORDER BY aprovadoEm DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).send("Erro ao buscar dados");
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(\`Servidor rodando em http://localhost:\${PORT}\`);
});
