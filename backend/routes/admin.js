'use strict';

/* ============================================
   COMERCIAL BUEN FE — Rutas Admin (CRUD completo)
   Montadas en: /api/admin
   ============================================ */

const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

/* ---- Helper: reemplazar atributos de un producto (en transacción) ---- */
async function reemplazarAtributos(conn, productoId, atributos = []) {
  await conn.query(
    'DELETE FROM producto_atributos WHERE producto_id = ?',
    [productoId]
  );
  if (atributos.length) {
    const vals = atributos.map((a, i) => [productoId, String(a).trim(), i]);
    await conn.query(
      'INSERT INTO producto_atributos (producto_id, atributo, orden) VALUES ?',
      [vals]
    );
  }
}

/* ---- Helper: adjuntar atributos a una lista de productos ---- */
async function adjuntarAtributos(rows) {
  if (!rows.length) return rows;
  const ids   = rows.map(p => p.id);
  const ph    = ids.map(() => '?').join(',');
  const [atr] = await db.query(
    `SELECT producto_id, atributo FROM producto_atributos
     WHERE producto_id IN (${ph}) ORDER BY producto_id, orden`,
    ids
  );
  const mapa = atr.reduce((acc, r) => {
    (acc[r.producto_id] = acc[r.producto_id] || []).push(r.atributo);
    return acc;
  }, {});
  return rows.map(p => ({ ...p, atributos: mapa[p.id] || [] }));
}

/* ============================================
   CATEGORÍAS
   ============================================ */

/* GET /api/admin/categorias — todas (incluidas inactivas) */
router.get('/categorias', async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.id, c.nombre, c.icono,
             COALESCE(c.descripcion, '') AS descripcion,
             COALESCE(c.activo, 1)       AS activo,
             COUNT(p.id)                 AS cantidad_productos
      FROM categorias c
      LEFT JOIN productos p ON p.categoria_id = c.id
      GROUP BY c.id, c.nombre, c.icono, c.descripcion, c.activo
      ORDER BY c.nombre
    `);
    res.json(rows);
  } catch (err) {
    console.error('[Admin] GET /categorias:', err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

/* POST /api/admin/categorias — crear categoría */
router.post('/categorias', async (req, res) => {
  try {
    const {
      id, nombre,
      icono       = '📦',
      descripcion = '',
      activo      = 1,
    } = req.body;

    if (!id || !nombre) {
      return res.status(400).json({ error: 'Los campos id y nombre son obligatorios' });
    }

    const [[existe]] = await db.query(
      'SELECT id FROM categorias WHERE id = ?', [id]
    );
    if (existe) {
      return res.status(409).json({ error: `Ya existe una categoría con el ID "${id}"` });
    }

    await db.query(
      'INSERT INTO categorias (id, nombre, icono, descripcion, activo) VALUES (?, ?, ?, ?, ?)',
      [id, nombre, icono, descripcion, activo ? 1 : 0]
    );

    const [[nueva]] = await db.query(
      `SELECT id, nombre, icono,
              COALESCE(descripcion,'') AS descripcion,
              COALESCE(activo,1)       AS activo,
              0                        AS cantidad_productos
       FROM categorias WHERE id = ?`,
      [id]
    );
    res.status(201).json(nueva);
  } catch (err) {
    console.error('[Admin] POST /categorias:', err);
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
});

/* PUT /api/admin/categorias/:id — editar categoría */
router.put('/categorias/:id', async (req, res) => {
  try {
    const { id }                       = req.params;
    const { nombre, icono, descripcion, activo } = req.body;

    const [[cat]] = await db.query(
      'SELECT id FROM categorias WHERE id = ?', [id]
    );
    if (!cat) return res.status(404).json({ error: 'Categoría no encontrada' });

    const campos = [];
    const vals   = [];
    if (nombre      !== undefined) { campos.push('nombre = ?');      vals.push(nombre); }
    if (icono       !== undefined) { campos.push('icono = ?');       vals.push(icono); }
    if (descripcion !== undefined) { campos.push('descripcion = ?'); vals.push(descripcion); }
    if (activo      !== undefined) { campos.push('activo = ?');      vals.push(activo ? 1 : 0); }

    if (campos.length) {
      vals.push(id);
      await db.query(`UPDATE categorias SET ${campos.join(', ')} WHERE id = ?`, vals);
    }

    const [[updated]] = await db.query(
      `SELECT c.id, c.nombre, c.icono,
              COALESCE(c.descripcion,'') AS descripcion,
              COALESCE(c.activo,1)       AS activo,
              COUNT(p.id)                AS cantidad_productos
       FROM categorias c
       LEFT JOIN productos p ON p.categoria_id = c.id
       WHERE c.id = ?
       GROUP BY c.id`,
      [id]
    );
    res.json(updated);
  } catch (err) {
    console.error('[Admin] PUT /categorias/:id:', err);
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
});

/* DELETE /api/admin/categorias/:id — eliminar (solo si no tiene productos) */
router.delete('/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [[{ cant }]] = await db.query(
      'SELECT COUNT(*) AS cant FROM productos WHERE categoria_id = ?', [id]
    );
    if (cant > 0) {
      return res.status(409).json({
        error: `No se puede eliminar: tiene ${cant} producto${cant !== 1 ? 's' : ''} asociado${cant !== 1 ? 's' : ''}`,
      });
    }

    const [result] = await db.query('DELETE FROM categorias WHERE id = ?', [id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Categoría no encontrada' });

    res.json({ ok: true });
  } catch (err) {
    console.error('[Admin] DELETE /categorias/:id:', err);
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});

/* ============================================
   PRODUCTOS
   ============================================ */

/* GET /api/admin/productos — todos (incluidos inactivos) */
router.get('/productos', async (req, res) => {
  try {
    const { cat, q, orden } = req.query;

    let sql = `
      SELECT p.id, p.nombre, p.categoria_id,
             c.nombre AS categoria_nombre, c.icono AS categoria_icono,
             p.precio, p.unidad, p.icono, p.badge,
             p.descripcion, p.activo, p.creado_en
      FROM productos p
      LEFT JOIN categorias c ON c.id = p.categoria_id
      WHERE 1=1
    `;
    const vals = [];

    if (cat) { sql += ' AND p.categoria_id = ?';                                    vals.push(cat); }
    if (q)   { sql += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';             vals.push(`%${q}%`, `%${q}%`); }

    const ordenes = {
      'precio-asc':  'p.precio ASC',
      'precio-desc': 'p.precio DESC',
      'nombre':      'p.nombre ASC',
    };
    sql += ` ORDER BY ${ordenes[orden] || 'p.id ASC'}`;

    const [rows] = await db.query(sql, vals);
    res.json(await adjuntarAtributos(rows));
  } catch (err) {
    console.error('[Admin] GET /productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

/* GET /api/admin/productos/:id */
router.get('/productos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const [[p]] = await db.query(
      `SELECT p.*, c.nombre AS categoria_nombre
       FROM productos p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       WHERE p.id = ?`,
      [id]
    );
    if (!p) return res.status(404).json({ error: 'Producto no encontrado' });

    const [atribs] = await db.query(
      'SELECT atributo FROM producto_atributos WHERE producto_id = ? ORDER BY orden',
      [id]
    );
    p.atributos = atribs.map(a => a.atributo);
    res.json(p);
  } catch (err) {
    console.error('[Admin] GET /productos/:id:', err);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

/* POST /api/admin/productos — crear producto */
router.post('/productos', async (req, res) => {
  try {
    const {
      nombre, categoria_id, precio, unidad = 'lb',
      icono = '📦', badge = null, descripcion, activo = 1,
      atributos = [],
    } = req.body;

    if (!nombre || !categoria_id || precio === undefined || !descripcion) {
      return res.status(400).json({
        error: 'nombre, categoria_id, precio y descripcion son obligatorios',
      });
    }

    const conn = await db.getConnection();
    let newId;
    try {
      await conn.beginTransaction();

      const [result] = await conn.query(
        `INSERT INTO productos
           (nombre, categoria_id, precio, unidad, icono, badge, descripcion, activo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [nombre, categoria_id, Number(precio), unidad, icono, badge || null, descripcion, activo ? 1 : 0]
      );
      newId = result.insertId;
      await reemplazarAtributos(conn, newId, atributos);

      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    const [[nuevo]] = await db.query(
      `SELECT p.*, c.nombre AS categoria_nombre
       FROM productos p LEFT JOIN categorias c ON c.id = p.categoria_id
       WHERE p.id = ?`,
      [newId]
    );
    const [atr] = await db.query(
      'SELECT atributo FROM producto_atributos WHERE producto_id = ? ORDER BY orden',
      [newId]
    );
    nuevo.atributos = atr.map(a => a.atributo);
    res.status(201).json(nuevo);
  } catch (err) {
    console.error('[Admin] POST /productos:', err);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

/* PUT /api/admin/productos/:id — editar producto */
router.put('/productos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const { nombre, categoria_id, precio, unidad, icono, badge, descripcion, activo, atributos } = req.body;

    const campos = [];
    const vals   = [];

    if (nombre      !== undefined) { campos.push('nombre = ?');      vals.push(nombre); }
    if (categoria_id!== undefined) { campos.push('categoria_id = ?'); vals.push(categoria_id); }
    if (precio      !== undefined) { campos.push('precio = ?');      vals.push(Number(precio)); }
    if (unidad      !== undefined) { campos.push('unidad = ?');      vals.push(unidad); }
    if (icono       !== undefined) { campos.push('icono = ?');       vals.push(icono); }
    if (badge       !== undefined) { campos.push('badge = ?');       vals.push(badge || null); }
    if (descripcion !== undefined) { campos.push('descripcion = ?'); vals.push(descripcion); }
    if (activo      !== undefined) { campos.push('activo = ?');      vals.push(activo ? 1 : 0); }

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      if (campos.length) {
        vals.push(id);
        await conn.query(`UPDATE productos SET ${campos.join(', ')} WHERE id = ?`, vals);
      }
      if (atributos !== undefined) {
        await reemplazarAtributos(conn, id, atributos);
      }
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    const [[updated]] = await db.query(
      `SELECT p.*, c.nombre AS categoria_nombre
       FROM productos p LEFT JOIN categorias c ON c.id = p.categoria_id
       WHERE p.id = ?`,
      [id]
    );
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });

    const [atr] = await db.query(
      'SELECT atributo FROM producto_atributos WHERE producto_id = ? ORDER BY orden',
      [id]
    );
    updated.atributos = atr.map(a => a.atributo);
    res.json(updated);
  } catch (err) {
    console.error('[Admin] PUT /productos/:id:', err);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

/* DELETE /api/admin/productos/:id — eliminar producto */
router.delete('/productos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Producto no encontrado' });

    res.json({ ok: true });
  } catch (err) {
    console.error('[Admin] DELETE /productos/:id:', err);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
