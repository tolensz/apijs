const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_FILE = 'dispositivos.json';

app.use(cors());
app.use(bodyParser.json());

// Cargar base de datos (simple archivo JSON)
let dispositivos = [];
if (fs.existsSync(DB_FILE)) {
  dispositivos = JSON.parse(fs.readFileSync(DB_FILE));
}

// Guardar base de datos al disco
function guardarDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(dispositivos, null, 2));
}

// 📥 Registrar nuevo dispositivo
app.post('/registrar', (req, res) => {
  const { clave } = req.body;
  if (!clave) return res.status(400).json({ ok: false, error: 'Falta clave' });

  if (!dispositivos.includes(clave)) {
    dispositivos.push(clave);
    guardarDB();
    console.log(`🔐 Registrado nuevo dispositivo: ${clave}`);
  }

  res.json({ ok: true });
});

// ✅ Validar si está autorizado
app.post('/validar', (req, res) => {
  const { clave } = req.body;
  if (!clave) return res.status(400).json({ autorizado: false });

  const autorizado = dispositivos.includes(clave);
  res.json({ autorizado });
});

// Servidor corriendo
app.listen(PORT, () => {
  console.log(`✅ API corriendo en https://apijs-production.up.railway.app:${PORT}`);
});
