const express = require("express");
const path = require("path");
const oracledb = require("oracledb");
require("dotenv").config();

const { getConnection } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// frontend
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/api/usuarios-ativos", async (req, res) => {
  let connection;

  try {
    connection = await getConnection();

    const sql = `
      select 
        a.ds_login,
        a.nm_subject,
        to_char(cast(b.dt_creation as date), 'DD/MM/YYYY hh24:mi:ss') dt_creation,
        to_char(cast(b.dt_expiration as date), 'DD/MM/YYYY hh24:mi:ss') dt_expiration,
        b.cd_establishment
      from subject_activity_log b
      join subject a on a.id = b.id_subject
      where b.cd_establishment = 64
        and sysdate >= trunc(b.dt_creation,'hh24') 
            + (trunc(to_char(b.dt_creation,'mi') / 10) * 10) / 1440
        and sysdate <= trunc(b.dt_expiration,'mi')
    `;

    const result = await connection.execute(
      sql,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json({
      totalAtivos: result.rows.length,
      usuarios: result.rows
    });

  } catch (err) {
    console.error("Erro Oracle:", err);
    res.status(500).json({ erro: "Erro ao buscar usuários ativos" });
  } finally {
    if (connection) await connection.close();
  }
});

// fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Sistema rodando em http://localhost:${PORT}`);
});
