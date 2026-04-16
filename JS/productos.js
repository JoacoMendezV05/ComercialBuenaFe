/* ============================================
   COMERCIAL BUEN FE — Datos de Productos
   ============================================ */

const PRODUCTOS = [
  /* ---- Frutos Secos ---- */
  {
    id: 1, nombre: 'Nueces Peladas', categoria: 'frutos-secos',
    precio: 8.50, unidad: 'lb', icono: '🌰', badge: 'popular',
    descripcion: 'Nueces de primera calidad, naturales y sin aditivos. Ricas en omega-3, antioxidantes y grasas saludables para el corazón.',
    atributos: ['Sin aditivos', 'Alto en omega-3', 'Cosecha selecta', 'Empaque sellado']
  },
  {
    id: 2, nombre: 'Almendras Tostadas', categoria: 'frutos-secos',
    precio: 9.00, unidad: 'lb', icono: '🫘', badge: 'popular',
    descripcion: 'Almendras cuidadosamente tostadas al natural, sin aceite ni sal añadida. Crujientes, nutritivas y perfectas como snack.',
    atributos: ['Sin aceite añadido', 'Alto en proteína', 'Tostado natural', 'Sin conservantes']
  },
  {
    id: 3, nombre: 'Maní Tostado', categoria: 'frutos-secos',
    precio: 3.50, unidad: 'lb', icono: '🥜', badge: null,
    descripcion: 'Maní tostado al natural, sin aceite ni sal añadida. Fuente de proteínas y grasas buenas, ideal para todas las edades.',
    atributos: ['Sin sal añadida', 'Alto en proteína', '100% natural', 'Sin gluten']
  },
  {
    id: 4, nombre: 'Avellanas', categoria: 'frutos-secos',
    precio: 11.00, unidad: 'lb', icono: '🌰', badge: null,
    descripcion: 'Avellanas enteras con piel, ideales para repostería, chocolatería y snacks. Ricas en vitamina E y magnesio.',
    atributos: ['Con piel natural', 'Alto en vit. E', 'Sabor intenso', 'Origen selecto']
  },
  {
    id: 5, nombre: 'Pistachos', categoria: 'frutos-secos',
    precio: 12.00, unidad: 'lb', icono: '🫛', badge: 'nuevo',
    descripcion: 'Pistachos selectos, tostados y ligeramente salados. Uno de los frutos secos más nutritivos con alto contenido en fibra y proteínas.',
    atributos: ['Ligeramente salado', 'Alto en fibra', 'Tostado artesanal', 'Selección premium']
  },
  {
    id: 6, nombre: 'Anacardos (Cashews)', categoria: 'frutos-secos',
    precio: 10.00, unidad: 'lb', icono: '🥜', badge: null,
    descripcion: 'Anacardos enteros de primera calidad, cremosos y nutritivos. Perfectos para cocinar, hacer leches vegetales o comer solos.',
    atributos: ['Enteros seleccionados', 'Cremosos', 'Sin cáscara', 'Versátiles']
  },

  /* ---- Granos ---- */
  {
    id: 7, nombre: 'Quinua Perlada', categoria: 'granos',
    precio: 5.00, unidad: 'lb', icono: '🌾', badge: 'popular',
    descripcion: 'Quinua blanca premium de origen andino, libre de gluten y rica en proteínas completas. El superalimento de los incas ahora en tu mesa.',
    atributos: ['Sin gluten', 'Proteína completa', 'Origen andino', 'Orgánica certificada']
  },
  {
    id: 8, nombre: 'Arroz Integral', categoria: 'granos',
    precio: 2.50, unidad: 'lb', icono: '🍚', badge: null,
    descripcion: 'Arroz integral de grano largo, con su salvado intacto. Más nutritivo que el arroz blanco, rico en fibra y vitaminas del complejo B.',
    atributos: ['Grano largo', 'Alto en fibra', 'Con salvado', 'Mínimo procesado']
  },
  {
    id: 9, nombre: 'Lentejas Verdes', categoria: 'granos',
    precio: 2.00, unidad: 'lb', icono: '🫘', badge: null,
    descripcion: 'Lentejas verdes seleccionadas, ideales para sopas, ensaladas y guisos. Gran fuente de proteína vegetal y hierro.',
    atributos: ['Alto en hierro', 'Proteína vegetal', 'Rápida cocción', 'Sin OGM']
  },
  {
    id: 10, nombre: 'Garbanzos', categoria: 'granos',
    precio: 2.50, unidad: 'lb', icono: '🫘', badge: null,
    descripcion: 'Garbanzos grandes y tiernos, perfectos para hummus, cocidos y ensaladas. Ricos en fibra, proteínas y minerales esenciales.',
    atributos: ['Tamaño grande', 'Alto en fibra', 'Versátiles', 'Sin aditivos']
  },
  {
    id: 11, nombre: 'Frijoles Negros', categoria: 'granos',
    precio: 2.00, unidad: 'lb', icono: '🫘', badge: null,
    descripcion: 'Frijoles negros seleccionados, deliciosos y nutritivos. Ricos en antioxidantes, hierro y proteínas vegetales de alta calidad.',
    atributos: ['Rico en antioxidantes', 'Alto en hierro', 'Cosecha fresca', 'Sin OGM']
  },
  {
    id: 12, nombre: 'Maíz Mote', categoria: 'granos',
    precio: 2.00, unidad: 'lb', icono: '🌽', badge: null,
    descripcion: 'Maíz mote pelado de primera calidad, tradicional de la gastronomía andina. Suave, nutritivo y versátil en la cocina ecuatoriana.',
    atributos: ['Tradición andina', 'Pelado listo', 'Sabor auténtico', 'Sin conservantes']
  },

  /* ---- Semillas ---- */
  {
    id: 13, nombre: 'Semillas de Chía', categoria: 'semillas',
    precio: 6.00, unidad: 'lb', icono: '🌱', badge: 'nuevo',
    descripcion: 'Semillas de chía ricas en omega-3, fibra y proteínas. Perfectas para puddings, smoothies, ensaladas y como espesante natural.',
    atributos: ['Rico en omega-3', 'Alto en fibra', 'Sin gluten', 'Superalimento']
  },
  {
    id: 14, nombre: 'Semillas de Sésamo', categoria: 'semillas',
    precio: 4.00, unidad: 'lb', icono: '🌾', badge: null,
    descripcion: 'Semillas de sésamo tostadas, ideales para cocina asiática, panadería y ensaladas. Ricas en calcio y grasas saludables.',
    atributos: ['Alto en calcio', 'Tostadas', 'Versátiles', 'Sabor intenso']
  },
  {
    id: 15, nombre: 'Semillas de Girasol', categoria: 'semillas',
    precio: 3.00, unidad: 'lb', icono: '🌻', badge: null,
    descripcion: 'Semillas de girasol peladas y tostadas, un snack saludable y energético. Ricas en vitamina E y ácidos grasos insaturados.',
    atributos: ['Alto en vit. E', 'Peladas', 'Snack energético', 'Sin sal añadida']
  },

  /* ---- Deshidratados ---- */
  {
    id: 16, nombre: 'Pasas de Uva', categoria: 'deshidratados',
    precio: 4.50, unidad: 'lb', icono: '🍇', badge: null,
    descripcion: 'Pasas naturales sin azúcar añadida, dulces y suaves. Perfectas para repostería, cereales, ensaladas y como snack natural.',
    atributos: ['Sin azúcar añadida', 'Naturalmente dulce', 'Sin conservantes', 'Deshidratado natural']
  },
  {
    id: 17, nombre: 'Orejones de Durazno', categoria: 'deshidratados',
    precio: 6.00, unidad: 'lb', icono: '🍑', badge: null,
    descripcion: 'Duraznos deshidratados sin conservantes, naturalmente dulces y con textura suave. Ricos en betacaroteno y potasio.',
    atributos: ['Sin conservantes', 'Rico en potasio', 'Textura suave', 'Deshidratado artesanal']
  },
  {
    id: 18, nombre: 'Coco Rallado', categoria: 'deshidratados',
    precio: 5.50, unidad: 'lb', icono: '🥥', badge: null,
    descripcion: 'Coco rallado deshidratado sin azúcar añadida, perfecto para repostería, currys, granolas y snacks tropicales.',
    atributos: ['Sin azúcar', 'Deshidratado natural', 'Para repostería', 'Aroma natural']
  }
];

const CATEGORIAS = [
  { id: 'todos',        nombre: 'Todos los productos', icono: '🛒',  cantidad: PRODUCTOS.length },
  { id: 'frutos-secos', nombre: 'Frutos Secos',        icono: '🌰',  cantidad: PRODUCTOS.filter(p => p.categoria === 'frutos-secos').length },
  { id: 'granos',       nombre: 'Granos',               icono: '🌾',  cantidad: PRODUCTOS.filter(p => p.categoria === 'granos').length },
  { id: 'semillas',     nombre: 'Semillas',             icono: '🌱',  cantidad: PRODUCTOS.filter(p => p.categoria === 'semillas').length },
  { id: 'deshidratados',nombre: 'Deshidratados',        icono: '🍇',  cantidad: PRODUCTOS.filter(p => p.categoria === 'deshidratados').length },
];

const CATEGORIA_LABELS = {
  'frutos-secos':  'Frutos Secos',
  'granos':        'Granos',
  'semillas':      'Semillas',
  'deshidratados': 'Deshidratados',
};
