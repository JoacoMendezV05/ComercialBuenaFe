'use strict';

/* ============================================
   MIGRACIONES AUTOMÁTICAS — Comercial Buen Fe
   Se ejecuta al arrancar el servidor.
   Compatible con MySQL 5.7 y 8.0+.
   ============================================ */

const db = require('./config/db');

const MIGRATIONS = [
  {
    desc: 'categorias.descripcion',
    check: `SELECT COUNT(*) AS cnt
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categorias' AND COLUMN_NAME = 'descripcion'`,
    apply: `ALTER TABLE categorias ADD COLUMN descripcion TEXT NULL AFTER icono`,
  },
  {
    desc: 'categorias.activo',
    check: `SELECT COUNT(*) AS cnt
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categorias' AND COLUMN_NAME = 'activo'`,
    apply: `ALTER TABLE categorias ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1 AFTER descripcion`,
  },
];

async function migrate() {
  try {
    const [[{ dbName }]] = await db.query('SELECT DATABASE() AS dbName');

    for (const m of MIGRATIONS) {
      const [[{ cnt }]] = await db.query(m.check, [dbName]);
      if (!cnt) {
        await db.query(m.apply);
        console.log(`✅ Migración aplicada: ${m.desc}`);
      }
    }
  } catch (err) {
    console.error('❌ Error en migraciones:', err.message);
  }
}

module.exports = migrate;
