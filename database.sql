-- ============================================================
--  COMERCIAL BUEN FE — Esquema MySQL
--  Ejecutar: mysql -u root -p < database.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS comercial_buen_fe
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE comercial_buen_fe;

-- ============================================================
--  TABLA: categorias
-- ============================================================
CREATE TABLE IF NOT EXISTS categorias (
  id          VARCHAR(30)   NOT NULL,
  nombre      VARCHAR(80)   NOT NULL,
  icono       VARCHAR(10)   NOT NULL DEFAULT '📦',
  descripcion TEXT          NULL,
  activo      TINYINT(1)    NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  TABLA: productos
-- ============================================================
CREATE TABLE IF NOT EXISTS productos (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  nombre        VARCHAR(120)    NOT NULL,
  categoria_id  VARCHAR(30)     NOT NULL,
  precio        DECIMAL(10, 2)  NOT NULL,
  unidad        VARCHAR(10)     NOT NULL DEFAULT 'lb',
  icono         VARCHAR(10)     NOT NULL,
  badge         ENUM('popular','nuevo','oferta') NULL DEFAULT NULL,
  descripcion   TEXT            NOT NULL,
  activo        TINYINT(1)      NOT NULL DEFAULT 1,
  creado_en     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_productos_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_categoria (categoria_id),
  INDEX idx_activo    (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  TABLA: producto_atributos
-- ============================================================
CREATE TABLE IF NOT EXISTS producto_atributos (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  producto_id INT UNSIGNED NOT NULL,
  atributo    VARCHAR(80)  NOT NULL,
  orden       TINYINT      NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  CONSTRAINT fk_atributos_producto
    FOREIGN KEY (producto_id) REFERENCES productos(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_producto (producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  TABLA: pedidos  (para uso futuro del carrito server-side)
-- ============================================================
CREATE TABLE IF NOT EXISTS pedidos (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  cliente_nombre VARCHAR(120)   NOT NULL,
  cliente_email  VARCHAR(180)   NOT NULL,
  cliente_tel    VARCHAR(30)    NULL,
  total          DECIMAL(10,2)  NOT NULL,
  envio          DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  estado         ENUM('pendiente','confirmado','enviado','entregado','cancelado')
                                NOT NULL DEFAULT 'pendiente',
  notas          TEXT           NULL,
  creado_en      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  TABLA: pedido_items
-- ============================================================
CREATE TABLE IF NOT EXISTS pedido_items (
  id          INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  pedido_id   INT UNSIGNED   NOT NULL,
  producto_id INT UNSIGNED   NOT NULL,
  cantidad    DECIMAL(10,3)  NOT NULL,
  precio_unit DECIMAL(10,2)  NOT NULL,
  subtotal    DECIMAL(10,2)  NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_items_pedido
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_items_producto
    FOREIGN KEY (producto_id) REFERENCES productos(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
--  SEED: categorias
-- ============================================================
INSERT INTO categorias (id, nombre, icono, descripcion, activo) VALUES
  ('frutos-secos',  'Frutos Secos',  '🌰', 'Nueces, almendras, maní y más frutos secos selectos.',      1),
  ('granos',        'Granos',        '🌾', 'Quinua, lentejas, garbanzos y granos andinos.',              1),
  ('semillas',      'Semillas',      '🌱', 'Chía, sésamo, girasol y otras semillas nutritivas.',         1),
  ('deshidratados', 'Deshidratados', '🍇', 'Pasas, orejones, coco rallado y frutas deshidratadas.',      1);


-- ============================================================
--  SEED: productos
-- ============================================================
INSERT INTO productos (id, nombre, categoria_id, precio, unidad, icono, badge, descripcion) VALUES
-- Frutos Secos
(1,  'Nueces Peladas',       'frutos-secos',  8.50, 'lb', '🌰', 'popular',
 'Nueces de primera calidad, naturales y sin aditivos. Ricas en omega-3, antioxidantes y grasas saludables para el corazón.'),
(2,  'Almendras Tostadas',   'frutos-secos',  9.00, 'lb', '🫘', 'popular',
 'Almendras cuidadosamente tostadas al natural, sin aceite ni sal añadida. Crujientes, nutritivas y perfectas como snack.'),
(3,  'Maní Tostado',         'frutos-secos',  3.50, 'lb', '🥜', NULL,
 'Maní tostado al natural, sin aceite ni sal añadida. Fuente de proteínas y grasas buenas, ideal para todas las edades.'),
(4,  'Avellanas',            'frutos-secos', 11.00, 'lb', '🌰', NULL,
 'Avellanas enteras con piel, ideales para repostería, chocolatería y snacks. Ricas en vitamina E y magnesio.'),
(5,  'Pistachos',            'frutos-secos', 12.00, 'lb', '🫛', 'nuevo',
 'Pistachos selectos, tostados y ligeramente salados. Uno de los frutos secos más nutritivos con alto contenido en fibra y proteínas.'),
(6,  'Anacardos (Cashews)',  'frutos-secos', 10.00, 'lb', '🥜', NULL,
 'Anacardos enteros de primera calidad, cremosos y nutritivos. Perfectos para cocinar, hacer leches vegetales o comer solos.'),
-- Granos
(7,  'Quinua Perlada',       'granos',        5.00, 'lb', '🌾', 'popular',
 'Quinua blanca premium de origen andino, libre de gluten y rica en proteínas completas. El superalimento de los incas ahora en tu mesa.'),
(8,  'Arroz Integral',       'granos',        2.50, 'lb', '🍚', NULL,
 'Arroz integral de grano largo, con su salvado intacto. Más nutritivo que el arroz blanco, rico en fibra y vitaminas del complejo B.'),
(9,  'Lentejas Verdes',      'granos',        2.00, 'lb', '🫘', NULL,
 'Lentejas verdes seleccionadas, ideales para sopas, ensaladas y guisos. Gran fuente de proteína vegetal y hierro.'),
(10, 'Garbanzos',            'granos',        2.50, 'lb', '🫘', NULL,
 'Garbanzos grandes y tiernos, perfectos para hummus, cocidos y ensaladas. Ricos en fibra, proteínas y minerales esenciales.'),
(11, 'Frijoles Negros',      'granos',        2.00, 'lb', '🫘', NULL,
 'Frijoles negros seleccionados, deliciosos y nutritivos. Ricos en antioxidantes, hierro y proteínas vegetales de alta calidad.'),
(12, 'Maíz Mote',            'granos',        2.00, 'lb', '🌽', NULL,
 'Maíz mote pelado de primera calidad, tradicional de la gastronomía andina. Suave, nutritivo y versátil en la cocina ecuatoriana.'),
-- Semillas
(13, 'Semillas de Chía',     'semillas',      6.00, 'lb', '🌱', 'nuevo',
 'Semillas de chía ricas en omega-3, fibra y proteínas. Perfectas para puddings, smoothies, ensaladas y como espesante natural.'),
(14, 'Semillas de Sésamo',   'semillas',      4.00, 'lb', '🌾', NULL,
 'Semillas de sésamo tostadas, ideales para cocina asiática, panadería y ensaladas. Ricas en calcio y grasas saludables.'),
(15, 'Semillas de Girasol',  'semillas',      3.00, 'lb', '🌻', NULL,
 'Semillas de girasol peladas y tostadas, un snack saludable y energético. Ricas en vitamina E y ácidos grasos insaturados.'),
-- Deshidratados
(16, 'Pasas de Uva',         'deshidratados', 4.50, 'lb', '🍇', NULL,
 'Pasas naturales sin azúcar añadida, dulces y suaves. Perfectas para repostería, cereales, ensaladas y como snack natural.'),
(17, 'Orejones de Durazno',  'deshidratados', 6.00, 'lb', '🍑', NULL,
 'Duraznos deshidratados sin conservantes, naturalmente dulces y con textura suave. Ricos en betacaroteno y potasio.'),
(18, 'Coco Rallado',         'deshidratados', 5.50, 'lb', '🥥', NULL,
 'Coco rallado deshidratado sin azúcar añadida, perfecto para repostería, currys, granolas y snacks tropicales.');


-- ============================================================
--  SEED: producto_atributos
-- ============================================================
INSERT INTO producto_atributos (producto_id, atributo, orden) VALUES
-- Nueces Peladas (1)
(1, 'Sin aditivos',      0), (1, 'Alto en omega-3',   1), (1, 'Cosecha selecta',   2), (1, 'Empaque sellado',   3),
-- Almendras Tostadas (2)
(2, 'Sin aceite añadido',0), (2, 'Alto en proteína',  1), (2, 'Tostado natural',   2), (2, 'Sin conservantes',  3),
-- Maní Tostado (3)
(3, 'Sin sal añadida',   0), (3, 'Alto en proteína',  1), (3, '100% natural',      2), (3, 'Sin gluten',        3),
-- Avellanas (4)
(4, 'Con piel natural',  0), (4, 'Alto en vit. E',    1), (4, 'Sabor intenso',     2), (4, 'Origen selecto',    3),
-- Pistachos (5)
(5, 'Ligeramente salado',0), (5, 'Alto en fibra',     1), (5, 'Tostado artesanal', 2), (5, 'Selección premium', 3),
-- Anacardos (6)
(6, 'Enteros seleccionados',0),(6,'Cremosos',          1), (6, 'Sin cáscara',       2), (6, 'Versátiles',        3),
-- Quinua Perlada (7)
(7, 'Sin gluten',        0), (7, 'Proteína completa', 1), (7, 'Origen andino',     2), (7, 'Orgánica certificada',3),
-- Arroz Integral (8)
(8, 'Grano largo',       0), (8, 'Alto en fibra',     1), (8, 'Con salvado',       2), (8, 'Mínimo procesado',  3),
-- Lentejas Verdes (9)
(9, 'Alto en hierro',    0), (9, 'Proteína vegetal',  1), (9, 'Rápida cocción',    2), (9, 'Sin OGM',           3),
-- Garbanzos (10)
(10,'Tamaño grande',     0),(10,'Alto en fibra',      1),(10,'Versátiles',         2),(10,'Sin aditivos',       3),
-- Frijoles Negros (11)
(11,'Rico en antioxidantes',0),(11,'Alto en hierro',  1),(11,'Cosecha fresca',     2),(11,'Sin OGM',            3),
-- Maíz Mote (12)
(12,'Tradición andina',  0),(12,'Pelado listo',       1),(12,'Sabor auténtico',    2),(12,'Sin conservantes',   3),
-- Semillas de Chía (13)
(13,'Rico en omega-3',   0),(13,'Alto en fibra',      1),(13,'Sin gluten',         2),(13,'Superalimento',      3),
-- Semillas de Sésamo (14)
(14,'Alto en calcio',    0),(14,'Tostadas',           1),(14,'Versátiles',         2),(14,'Sabor intenso',      3),
-- Semillas de Girasol (15)
(15,'Alto en vit. E',    0),(15,'Peladas',            1),(15,'Snack energético',   2),(15,'Sin sal añadida',    3),
-- Pasas de Uva (16)
(16,'Sin azúcar añadida',0),(16,'Naturalmente dulce', 1),(16,'Sin conservantes',   2),(16,'Deshidratado natural',3),
-- Orejones de Durazno (17)
(17,'Sin conservantes',  0),(17,'Rico en potasio',    1),(17,'Textura suave',      2),(17,'Deshidratado artesanal',3),
-- Coco Rallado (18)
(18,'Sin azúcar',        0),(18,'Deshidratado natural',1),(18,'Para repostería',   2),(18,'Aroma natural',      3);


-- ============================================================
--  VISTA: vista_productos (para consultas rápidas completas)
-- ============================================================
CREATE OR REPLACE VIEW vista_productos AS
  SELECT
    p.id,
    p.nombre,
    p.categoria_id,
    c.nombre        AS categoria_nombre,
    c.icono         AS categoria_icono,
    p.precio,
    p.unidad,
    p.icono,
    p.badge,
    p.descripcion,
    p.activo,
    p.creado_en
  FROM productos p
  INNER JOIN categorias c ON c.id = p.categoria_id
  WHERE p.activo = 1 AND COALESCE(c.activo, 1) = 1;


-- ============================================================
--  MIGRACIÓN: columnas nuevas en categorias
--  (seguro re-ejecutar; ADD COLUMN IF NOT EXISTS requiere MySQL 8+)
-- ============================================================
ALTER TABLE categorias
  ADD COLUMN IF NOT EXISTS descripcion TEXT          NULL         AFTER icono,
  ADD COLUMN IF NOT EXISTS activo      TINYINT(1)    NOT NULL DEFAULT 1 AFTER descripcion;
