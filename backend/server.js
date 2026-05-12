'use strict';

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const productosRouter = require('./routes/productos');
const adminRouter     = require('./routes/admin');
const migrate         = require('./migrate');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ estado: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/admin', adminRouter);    // CRUD completo para el panel admin
app.use('/api',       productosRouter); // rutas públicas (solo lectura)

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  await migrate(); // Aplicar migraciones pendientes al arrancar
});
