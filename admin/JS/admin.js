/* ============================================
   COMERCIAL BUEN FE — Panel Administrativo
   ============================================ */

/* ============================================
   AUTENTICACIÓN
   ============================================
   Credenciales por defecto: admin / BuenFe2024!
   Para cambiarlas, actualiza ADMIN_HASH:
     btoa('nuevoUsuario:nuevaContraseña')
   ============================================ */
const ADMIN_HASH = 'YWRtaW46QnVlbkZlMjAyNCE='; // admin:BuenFe2024!

const AUTH = {
  _sk: 'cbf_admin_ok',
  _uk: 'cbf_admin_user',

  verificar(user, pass) {
    try { return btoa(`${user}:${pass}`) === ADMIN_HASH; }
    catch { return false; }
  },
  logueado()  { return sessionStorage.getItem(this._sk) === '1'; },
  usuario()   { return sessionStorage.getItem(this._uk) || 'Admin'; },
  login(u, p) {
    if (!this.verificar(u, p)) return false;
    sessionStorage.setItem(this._sk, '1');
    sessionStorage.setItem(this._uk, u);
    return true;
  },
  logout() {
    sessionStorage.removeItem(this._sk);
    sessionStorage.removeItem(this._uk);
    window.location.href = 'login.html';
  },
  requerir() {
    if (!this.logueado()) { window.location.href = 'login.html'; return false; }
    return true;
  },
};

/* ============================================
   BACKEND API
   ============================================ */
const API_ADMIN  = 'http://localhost:3000/api/admin';
const API_HEALTH = 'http://localhost:3000/api/health';
let _modoAPI = false;

async function checkAPI() {
  try {
    const res = await fetch(API_HEALTH, { signal: AbortSignal.timeout(2500) });
    _modoAPI = res.ok;
  } catch {
    _modoAPI = false;
  }
  return _modoAPI;
}

async function apiFetch(ruta, opts = {}) {
  const res = await fetch(`${API_ADMIN}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return res.json();
}

/* ============================================
   DATOS POR DEFECTO (seed inicial localStorage)
   ============================================ */
const DEFAULT_CATEGORIAS = [
  { id: 'frutos-secos',  nombre: 'Frutos Secos',  icono: '🌰', descripcion: 'Nueces, almendras, maní y más frutos secos selectos.', activo: true },
  { id: 'granos',        nombre: 'Granos',         icono: '🌾', descripcion: 'Quinua, lentejas, garbanzos y granos andinos.', activo: true },
  { id: 'semillas',      nombre: 'Semillas',        icono: '🌱', descripcion: 'Chía, sésamo, girasol y otras semillas nutritivas.', activo: true },
  { id: 'deshidratados', nombre: 'Deshidratados',   icono: '🍇', descripcion: 'Pasas, orejones, coco rallado y frutas deshidratadas.', activo: true },
];

const DEFAULT_PRODUCTOS = [
  { id:1,  nombre:'Nueces Peladas',        categoria:'frutos-secos', precio:8.50,  unidad:'lb', icono:'🌰', badge:'popular', activo:true, descripcion:'Nueces de primera calidad, naturales y sin aditivos. Ricas en omega-3, antioxidantes y grasas saludables.', atributos:['Sin aditivos','Alto en omega-3','Cosecha selecta','Empaque sellado'] },
  { id:2,  nombre:'Almendras Tostadas',    categoria:'frutos-secos', precio:9.00,  unidad:'lb', icono:'🫘', badge:'popular', activo:true, descripcion:'Almendras cuidadosamente tostadas al natural, sin aceite ni sal añadida. Crujientes y nutritivas.', atributos:['Sin aceite añadido','Alto en proteína','Tostado natural','Sin conservantes'] },
  { id:3,  nombre:'Maní Tostado',          categoria:'frutos-secos', precio:3.50,  unidad:'lb', icono:'🥜', badge:null,      activo:true, descripcion:'Maní tostado al natural, sin aceite ni sal añadida. Fuente de proteínas y grasas buenas.', atributos:['Sin sal añadida','Alto en proteína','100% natural','Sin gluten'] },
  { id:4,  nombre:'Avellanas',             categoria:'frutos-secos', precio:11.00, unidad:'lb', icono:'🌰', badge:null,      activo:true, descripcion:'Avellanas enteras con piel, ideales para repostería y snacks. Ricas en vitamina E y magnesio.', atributos:['Con piel natural','Alto en vit. E','Sabor intenso','Origen selecto'] },
  { id:5,  nombre:'Pistachos',             categoria:'frutos-secos', precio:12.00, unidad:'lb', icono:'🫛', badge:'nuevo',   activo:true, descripcion:'Pistachos selectos, tostados y ligeramente salados. Ricos en fibra y proteínas.', atributos:['Ligeramente salado','Alto en fibra','Tostado artesanal','Selección premium'] },
  { id:6,  nombre:'Anacardos (Cashews)',   categoria:'frutos-secos', precio:10.00, unidad:'lb', icono:'🥜', badge:null,      activo:true, descripcion:'Anacardos enteros de primera calidad, cremosos y nutritivos. Perfectos para cocinar o comer solos.', atributos:['Enteros seleccionados','Cremosos','Sin cáscara','Versátiles'] },
  { id:7,  nombre:'Quinua Perlada',        categoria:'granos',       precio:5.00,  unidad:'lb', icono:'🌾', badge:'popular', activo:true, descripcion:'Quinua blanca premium de origen andino, libre de gluten y rica en proteínas completas.', atributos:['Sin gluten','Proteína completa','Origen andino','Orgánica certificada'] },
  { id:8,  nombre:'Arroz Integral',        categoria:'granos',       precio:2.50,  unidad:'lb', icono:'🍚', badge:null,      activo:true, descripcion:'Arroz integral de grano largo, con su salvado intacto. Rico en fibra y vitaminas B.', atributos:['Grano largo','Alto en fibra','Con salvado','Mínimo procesado'] },
  { id:9,  nombre:'Lentejas Verdes',       categoria:'granos',       precio:2.00,  unidad:'lb', icono:'🫘', badge:null,      activo:true, descripcion:'Lentejas verdes seleccionadas, ideales para sopas y guisos. Gran fuente de proteína vegetal.', atributos:['Alto en hierro','Proteína vegetal','Rápida cocción','Sin OGM'] },
  { id:10, nombre:'Garbanzos',             categoria:'granos',       precio:2.50,  unidad:'lb', icono:'🫘', badge:null,      activo:true, descripcion:'Garbanzos grandes y tiernos, perfectos para hummus y cocidos. Ricos en fibra y proteínas.', atributos:['Tamaño grande','Alto en fibra','Versátiles','Sin aditivos'] },
  { id:11, nombre:'Frijoles Negros',       categoria:'granos',       precio:2.00,  unidad:'lb', icono:'🫘', badge:null,      activo:true, descripcion:'Frijoles negros seleccionados. Ricos en antioxidantes, hierro y proteínas vegetales.', atributos:['Rico en antioxidantes','Alto en hierro','Cosecha fresca','Sin OGM'] },
  { id:12, nombre:'Maíz Mote',             categoria:'granos',       precio:2.00,  unidad:'lb', icono:'🌽', badge:null,      activo:true, descripcion:'Maíz mote pelado de primera calidad, tradicional de la gastronomía andina.', atributos:['Tradición andina','Pelado listo','Sabor auténtico','Sin conservantes'] },
  { id:13, nombre:'Semillas de Chía',      categoria:'semillas',     precio:6.00,  unidad:'lb', icono:'🌱', badge:'nuevo',   activo:true, descripcion:'Semillas de chía ricas en omega-3, fibra y proteínas. Perfectas para puddings y smoothies.', atributos:['Rico en omega-3','Alto en fibra','Sin gluten','Superalimento'] },
  { id:14, nombre:'Semillas de Sésamo',    categoria:'semillas',     precio:4.00,  unidad:'lb', icono:'🌾', badge:null,      activo:true, descripcion:'Semillas de sésamo tostadas, ideales para cocina asiática y panadería. Ricas en calcio.', atributos:['Alto en calcio','Tostadas','Versátiles','Sabor intenso'] },
  { id:15, nombre:'Semillas de Girasol',   categoria:'semillas',     precio:3.00,  unidad:'lb', icono:'🌻', badge:null,      activo:true, descripcion:'Semillas de girasol peladas y tostadas. Ricas en vitamina E y ácidos grasos insaturados.', atributos:['Alto en vit. E','Peladas','Snack energético','Sin sal añadida'] },
  { id:16, nombre:'Pasas de Uva',          categoria:'deshidratados', precio:4.50, unidad:'lb', icono:'🍇', badge:null,      activo:true, descripcion:'Pasas naturales sin azúcar añadida. Perfectas para repostería, cereales y snacks.', atributos:['Sin azúcar añadida','Naturalmente dulce','Sin conservantes','Deshidratado natural'] },
  { id:17, nombre:'Orejones de Durazno',   categoria:'deshidratados', precio:6.00, unidad:'lb', icono:'🍑', badge:null,      activo:true, descripcion:'Duraznos deshidratados sin conservantes, naturalmente dulces. Ricos en betacaroteno y potasio.', atributos:['Sin conservantes','Rico en potasio','Textura suave','Deshidratado artesanal'] },
  { id:18, nombre:'Coco Rallado',          categoria:'deshidratados', precio:5.50, unidad:'lb', icono:'🥥', badge:null,      activo:true, descripcion:'Coco rallado deshidratado sin azúcar añadida, perfecto para repostería y granolas.', atributos:['Sin azúcar','Deshidratado natural','Para repostería','Aroma natural'] },
];

/* ============================================
   DATA — API-first, localStorage como fallback
   ============================================ */
const _LS = {
  KEYS: {
    productos:  'cbf_admin_productos',
    categorias: 'cbf_admin_categorias',
    nextId:     'cbf_admin_next_id',
  },
  get(key)      { return JSON.parse(localStorage.getItem(this.KEYS[key]) || 'null'); },
  set(key, val) { localStorage.setItem(this.KEYS[key], JSON.stringify(val)); },
  nextId() {
    const n = parseInt(localStorage.getItem(this.KEYS.nextId) || '19');
    localStorage.setItem(this.KEYS.nextId, String(n + 1));
    return n;
  },
};

const DATA = {
  /* ---- Seed localStorage (solo en modo offline) ---- */
  seed() {
    if (_modoAPI) return;
    if (!_LS.get('productos'))  _LS.set('productos',  DEFAULT_PRODUCTOS);
    if (!_LS.get('categorias')) _LS.set('categorias', DEFAULT_CATEGORIAS);
    if (!localStorage.getItem(_LS.KEYS.nextId)) localStorage.setItem(_LS.KEYS.nextId, '19');
  },

  /* ---- Categorías ---- */
  async getCategorias() {
    if (_modoAPI) return apiFetch('/categorias');
    return _LS.get('categorias') || [];
  },

  async getCategoria(id) {
    const lista = await this.getCategorias();
    return lista.find(c => c.id === id) || null;
  },

  async addCategoria(datos) {
    if (_modoAPI) {
      return apiFetch('/categorias', { method: 'POST', body: JSON.stringify(datos) });
    }
    const lista = _LS.get('categorias') || [];
    if (lista.find(x => x.id === datos.id)) return null; // ID duplicado
    lista.push({ ...datos, creado: new Date().toISOString() });
    _LS.set('categorias', lista);
    return datos;
  },

  async updateCategoria(id, cambios) {
    if (_modoAPI) {
      return apiFetch(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(cambios) });
    }
    const lista = (_LS.get('categorias') || []).map(c => c.id === id ? { ...c, ...cambios, id } : c);
    _LS.set('categorias', lista);
  },

  async deleteCategoria(id) {
    if (_modoAPI) {
      await apiFetch(`/categorias/${id}`, { method: 'DELETE' });
      return true;
    }
    const productos = _LS.get('productos') || [];
    if (productos.some(p => p.categoria === id)) return false;
    _LS.set('categorias', (_LS.get('categorias') || []).filter(c => c.id !== id));
    return true;
  },

  /* ---- Productos ---- */
  async getProductos() {
    if (_modoAPI) return apiFetch('/productos');
    return _LS.get('productos') || [];
  },

  async getProducto(id) {
    if (_modoAPI) return apiFetch(`/productos/${id}`);
    return (_LS.get('productos') || []).find(p => p.id === id) || null;
  },

  async addProducto(datos) {
    if (_modoAPI) {
      // Mapear campo 'categoria' → 'categoria_id' para el API
      const { categoria, ...resto } = datos;
      return apiFetch('/productos', {
        method: 'POST',
        body: JSON.stringify({ ...resto, categoria_id: categoria }),
      });
    }
    const lista = _LS.get('productos') || [];
    const nuevo = { ...datos, id: _LS.nextId(), creado: new Date().toISOString() };
    lista.push(nuevo);
    _LS.set('productos', lista);
    return nuevo;
  },

  async updateProducto(id, cambios) {
    if (_modoAPI) {
      const { categoria, ...resto } = cambios;
      return apiFetch(`/productos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...resto, categoria_id: categoria }),
      });
    }
    _LS.set('productos', (_LS.get('productos') || []).map(p => p.id === id ? { ...p, ...cambios, id } : p));
  },

  async deleteProducto(id) {
    if (_modoAPI) {
      return apiFetch(`/productos/${id}`, { method: 'DELETE' });
    }
    _LS.set('productos', (_LS.get('productos') || []).filter(p => p.id !== id));
  },
};

/* ============================================
   CACHE DE CATEGORÍAS (para _catLabel síncrono)
   ============================================ */
let _catsCache = [];

function _catLabel(catId) {
  const c = _catsCache.find(x => x.id === catId);
  return c ? `${c.icono} ${c.nombre}` : (catId || '—');
}

/* ============================================
   UI — TOAST
   ============================================ */
function toast(msg, tipo = 'ok') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `toast${tipo === 'error' ? ' error' : tipo === 'warn' ? ' warn' : ''}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => {
    el.style.animation = 'toastIn 0.28s ease reverse';
    setTimeout(() => el.remove(), 260);
  }, 2800);
}

/* ============================================
   UI — MODAL
   ============================================ */
function abrirModal(id)  { document.getElementById(id)?.classList.add('visible'); }
function cerrarModal(id) { document.getElementById(id)?.classList.remove('visible'); }
function cerrarModales() {
  document.querySelectorAll('.modal-overlay, .confirm-overlay').forEach(m => m.classList.remove('visible'));
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModales(); });

/* ============================================
   UI — CONFIRM
   ============================================ */
let _confirmCb = null;
function confirmar(titulo, texto, cb) {
  document.getElementById('confirm-titulo').textContent = titulo;
  document.getElementById('confirm-texto').textContent  = texto;
  _confirmCb = cb;
  abrirModal('confirm-overlay');
}
function initConfirm() {
  document.getElementById('confirm-ok')?.addEventListener('click', () => {
    cerrarModal('confirm-overlay');
    const result = _confirmCb?.();
    if (result instanceof Promise) result.catch(err => toast(err.message || 'Error inesperado', 'error'));
  });
  document.getElementById('confirm-cancelar')?.addEventListener('click', () => cerrarModal('confirm-overlay'));
}

/* ============================================
   UI — ATRIBUTOS DINÁMICOS
   ============================================ */
function initAtributosUI(wrapId, inicial = []) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  let lista = [...inicial];

  function render() {
    const tagsEl = wrap.querySelector('.atributos-tags');
    tagsEl.innerHTML = lista.map((a, i) => `
      <span class="atributo-tag">${a}
        <button type="button" data-i="${i}" title="Eliminar">×</button>
      </span>`).join('');
    tagsEl.querySelectorAll('button').forEach(btn =>
      btn.addEventListener('click', () => { lista.splice(parseInt(btn.dataset.i), 1); render(); })
    );
  }

  const addBtn   = wrap.querySelector('.atributos-add-btn');
  const addInput = wrap.querySelector('.atributos-add input');

  function agregar() {
    const v = addInput.value.trim();
    if (!v || lista.includes(v)) return;
    lista.push(v);
    addInput.value = '';
    render();
  }

  addBtn?.addEventListener('click', agregar);
  addInput?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); agregar(); } });

  render();
  wrap._getAtributos = () => [...lista];
  wrap._setAtributos = a => { lista = [...a]; render(); };
}

/* ============================================
   SIDEBAR — renderizado compartido
   ============================================ */
function renderSidebar(activo) {
  const el = document.getElementById('sidebar');
  if (!el) return;

  el.innerHTML = `
    <div class="sidebar-logo">
      <img src="../Imágenes/LOGO.jpg" alt="Logo" class="sidebar-logo-img" onerror="this.style.display='none'">
      <div>
        <div class="sidebar-logo-nombre">Comercial Buen Fe</div>
        <div class="sidebar-logo-sub">Panel Admin</div>
      </div>
    </div>
    <div class="sidebar-admin-pill">
      <div class="sidebar-admin-label">Sesión activa</div>
      <div class="sidebar-admin-user">👤 ${AUTH.usuario()}</div>
    </div>
    <nav class="sidebar-nav">
      <div class="sidebar-section">Principal</div>
      <a href="index.html"      class="${activo === 'dashboard'  ? 'activo' : ''}"><span class="nav-icon">📊</span>Dashboard</a>
      <a href="productos.html"  class="${activo === 'productos'  ? 'activo' : ''}"><span class="nav-icon">🛒</span>Productos</a>
      <a href="categorias.html" class="${activo === 'categorias' ? 'activo' : ''}"><span class="nav-icon">🗂️</span>Categorías</a>
      <div class="sidebar-section">Sitio</div>
      <a href="../index.html" target="_blank"><span class="nav-icon">🌐</span>Ver sitio</a>
    </nav>
    <div class="sidebar-conexion" id="sidebar-conexion">
      <span class="conexion-dot"></span>
      <span id="conexion-label">Comprobando…</span>
    </div>
    <div class="sidebar-footer">
      <a href="#" id="btn-logout"><span class="nav-icon">🚪</span>Cerrar sesión</a>
    </div>`;

  // Actualizar indicador de conexión
  const badge = document.getElementById('sidebar-conexion');
  const label = document.getElementById('conexion-label');
  if (_modoAPI) {
    badge?.classList.add('online');
    if (label) label.textContent = 'Conectado a BD';
  } else {
    badge?.classList.remove('online');
    if (label) label.textContent = 'Modo offline';
  }

  document.getElementById('btn-logout')?.addEventListener('click', e => { e.preventDefault(); AUTH.logout(); });

  // Toggle móvil
  const toggle  = document.getElementById('menu-toggle-admin');
  const overlay = document.getElementById('sidebar-overlay');
  toggle?.addEventListener('click', () => {
    el.classList.toggle('abierto');
    overlay?.classList.toggle('visible');
  });
  overlay?.addEventListener('click', () => {
    el.classList.remove('abierto');
    overlay?.classList.remove('visible');
  });
}

/* ============================================
   PÁGINA: DASHBOARD
   ============================================ */
async function initDashboard() {
  if (!document.getElementById('page-dashboard')) return;

  const [productos, categorias] = await Promise.all([
    DATA.getProductos(),
    DATA.getCategorias(),
  ]);

  const activos   = productos.filter(p => p.activo !== false);
  const populares = productos.filter(p => p.badge === 'popular').length;

  document.getElementById('stat-productos').textContent  = activos.length;
  document.getElementById('stat-categorias').textContent = categorias.filter(c => c.activo !== false).length;
  document.getElementById('stat-populares').textContent  = populares;

  // Resumen por categoría
  const resumenEl = document.getElementById('resumen-categorias');
  if (resumenEl) {
    resumenEl.innerHTML = categorias.map(c => {
      // Compatibilidad API (categoria_id) y localStorage (categoria)
      const cant = activos.filter(p => (p.categoria_id || p.categoria) === c.id).length;
      return `
        <tr>
          <td>${c.icono} ${c.nombre}</td>
          <td><strong>${cant}</strong></td>
          <td>${cant > 0 && activos.length > 0 ? Math.round(cant / activos.length * 100) : 0}%</td>
          <td><span class="badge badge-${c.activo !== false ? 'activo' : 'inactivo'}">${c.activo !== false ? '✓ Activa' : 'Inactiva'}</span></td>
        </tr>`;
    }).join('');
  }

  // Últimos productos
  const ultimosEl = document.getElementById('ultimos-productos');
  if (ultimosEl) {
    const ultimos = [...productos].reverse().slice(0, 6);
    ultimosEl.innerHTML = ultimos.map(p => `
      <tr>
        <td class="emoji-cell">${p.icono}</td>
        <td><strong>${p.nombre}</strong></td>
        <td>${p.badge ? `<span class="badge badge-${p.badge}">${p.badge}</span>` : '<span class="text-muted">—</span>'}</td>
        <td><strong>$${Number(p.precio).toFixed(2)}</strong>/${p.unidad}</td>
        <td><span class="badge badge-${p.activo !== false ? 'activo' : 'inactivo'}">${p.activo !== false ? 'Activo' : 'Oculto'}</span></td>
        <td>
          <a href="productos.html?editar=${p.id}" class="btn btn-outline btn-sm">Editar</a>
        </td>
      </tr>`).join('');
  }
}

/* ============================================
   PÁGINA: PRODUCTOS
   ============================================ */
let _productosEditId = null;
let _renderProductos = null;

function initProductos() {
  if (!document.getElementById('page-productos')) return;

  let busqueda       = '';
  let catFiltro      = '';
  let mostrarInact   = false;

  async function render() {
    try {
      // Cargar datos y actualizar cache de categorías
      const [allProds, cats] = await Promise.all([DATA.getProductos(), DATA.getCategorias()]);
      _catsCache = cats;

      // Filtrar
      let lista = [...allProds];
      if (!mostrarInact) lista = lista.filter(p => p.activo !== false);
      if (catFiltro) lista = lista.filter(p => (p.categoria_id || p.categoria) === catFiltro);
      if (busqueda) {
        const q = busqueda.toLowerCase();
        lista = lista.filter(p => p.nombre.toLowerCase().includes(q) || (p.descripcion || '').toLowerCase().includes(q));
      }

      document.getElementById('productos-count').textContent = `${lista.length} producto${lista.length !== 1 ? 's' : ''}`;

      const tbody = document.getElementById('productos-tbody');
      if (!lista.length) {
        tbody.innerHTML = `<tr><td colspan="7" class="tabla-vacia">
          <div class="tabla-vacia-icon">📦</div><p>No se encontraron productos</p></td></tr>`;
        return;
      }

      tbody.innerHTML = lista.map(p => {
        const catId = p.categoria_id || p.categoria;
        return `
          <tr>
            <td class="emoji-cell">${p.icono}</td>
            <td>
              <strong>${p.nombre}</strong><br>
              <span class="text-muted" style="font-size:12px">${(p.descripcion || '').slice(0, 55)}…</span>
            </td>
            <td>${_catLabel(catId)}</td>
            <td><strong>$${Number(p.precio).toFixed(2)}</strong> <span class="text-muted">/${p.unidad}</span></td>
            <td>${p.badge ? `<span class="badge badge-${p.badge}">${p.badge}</span>` : '<span class="badge badge-sin">—</span>'}</td>
            <td><span class="badge badge-${p.activo !== false ? 'activo' : 'inactivo'}">${p.activo !== false ? 'Activo' : 'Oculto'}</span></td>
            <td>
              <div class="d-flex gap-8">
                <button class="btn btn-outline btn-sm btn-icon" title="Editar"   data-edit="${p.id}">✏️</button>
                <button class="btn btn-danger  btn-sm btn-icon" title="Eliminar" data-del="${p.id}">🗑</button>
              </div>
            </td>
          </tr>`;
      }).join('');

      tbody.querySelectorAll('[data-edit]').forEach(btn =>
        btn.addEventListener('click', () => abrirModalProducto(parseInt(btn.dataset.edit)))
      );
      tbody.querySelectorAll('[data-del]').forEach(btn =>
        btn.addEventListener('click', () => confirmarEliminarProducto(parseInt(btn.dataset.del)))
      );
    } catch (err) {
      toast('Error al cargar productos: ' + err.message, 'error');
    }
  }

  // Poblar select de categorías en filtros
  (async () => {
    const cats = await DATA.getCategorias();
    _catsCache = cats;
    const selectCat = document.getElementById('filtro-cat');
    cats.forEach(c => {
      const o = document.createElement('option');
      o.value = c.id; o.textContent = `${c.icono} ${c.nombre}`;
      selectCat?.appendChild(o);
    });
  })();

  document.getElementById('busqueda-productos')?.addEventListener('input', e => { busqueda = e.target.value; render(); });
  document.getElementById('filtro-cat')?.addEventListener('change', e => { catFiltro = e.target.value; render(); });
  document.getElementById('toggle-inactivos')?.addEventListener('change', e => { mostrarInact = e.target.checked; render(); });
  document.getElementById('btn-nuevo-producto')?.addEventListener('click', () => abrirModalProducto(null));

  // Auto-abrir edición desde URL
  const params = new URLSearchParams(window.location.search);
  if (params.get('editar')) abrirModalProducto(parseInt(params.get('editar')));

  _renderProductos = render;
  render();
}

async function abrirModalProducto(id = null) {
  _productosEditId = id;
  const es_nuevo   = id === null;

  document.getElementById('modal-producto-titulo').textContent  = es_nuevo ? '➕ Nuevo Producto' : '✏️ Editar Producto';
  document.getElementById('modal-producto-guardar').textContent = es_nuevo ? 'Crear producto' : 'Guardar cambios';

  const form = document.getElementById('form-producto');
  form.reset();

  // Poblar select de categorías
  const selCat = document.getElementById('prod-categoria');
  selCat.innerHTML = '<option value="">Selecciona categoría…</option>';
  const cats = await DATA.getCategorias();
  cats.filter(c => c.activo !== false).forEach(c => {
    const o = document.createElement('option');
    o.value = c.id; o.textContent = `${c.icono} ${c.nombre}`;
    selCat.appendChild(o);
  });

  // Inicializar atributos vacíos
  initAtributosUI('atributos-container', []);

  if (!es_nuevo) {
    try {
      const p = await DATA.getProducto(id);
      if (!p) { toast('Producto no encontrado', 'error'); return; }

      form.elements['nombre'].value      = p.nombre;
      form.elements['categoria'].value   = p.categoria_id || p.categoria;
      form.elements['precio'].value      = p.precio;
      form.elements['unidad'].value      = p.unidad;
      form.elements['icono'].value       = p.icono;
      form.elements['badge'].value       = p.badge || '';
      form.elements['descripcion'].value = p.descripcion;
      form.elements['activo'].checked    = p.activo !== false;
      document.getElementById('emoji-preview').textContent = p.icono;
      document.getElementById('atributos-container')._setAtributos(p.atributos || []);
    } catch (err) {
      toast('Error al cargar producto: ' + err.message, 'error');
      return;
    }
  } else {
    document.getElementById('emoji-preview').textContent = '📦';
  }

  abrirModal('modal-producto-overlay');
  form.elements['nombre']?.focus();
}

async function guardarProducto(e) {
  e.preventDefault();
  const form = e.target;
  const atributosWrap = document.getElementById('atributos-container');

  const datos = {
    nombre:      form.elements['nombre'].value.trim(),
    categoria:   form.elements['categoria'].value,
    precio:      parseFloat(form.elements['precio'].value),
    unidad:      form.elements['unidad'].value,
    icono:       form.elements['icono'].value.trim() || '📦',
    badge:       form.elements['badge'].value || null,
    descripcion: form.elements['descripcion'].value.trim(),
    activo:      form.elements['activo'].checked,
    atributos:   atributosWrap?._getAtributos() || [],
  };

  if (!datos.nombre || !datos.categoria || isNaN(datos.precio)) {
    toast('Completa los campos obligatorios', 'error');
    return;
  }

  // Deshabilitar botón mientras guarda
  const btnGuardar = document.getElementById('modal-producto-guardar');
  btnGuardar.disabled = true;
  btnGuardar.textContent = 'Guardando…';

  try {
    if (_productosEditId === null) {
      await DATA.addProducto(datos);
      toast(`✅ Producto "${datos.nombre}" creado`);
    } else {
      await DATA.updateProducto(_productosEditId, datos);
      toast(`✅ Producto "${datos.nombre}" actualizado`);
    }
    cerrarModal('modal-producto-overlay');
    _renderProductos?.();
  } catch (err) {
    toast(err.message || 'Error al guardar', 'error');
  } finally {
    btnGuardar.disabled = false;
    btnGuardar.textContent = _productosEditId === null ? 'Crear producto' : 'Guardar cambios';
  }
}

async function confirmarEliminarProducto(id) {
  let p;
  try {
    p = await DATA.getProducto(id);
  } catch (err) {
    toast(err.message || 'Error al obtener producto', 'error');
    return;
  }
  if (!p) return;

  confirmar(
    'Eliminar producto',
    `¿Seguro que deseas eliminar "${p.nombre}"? Esta acción no se puede deshacer.`,
    async () => {
      await DATA.deleteProducto(id);
      toast(`🗑 "${p.nombre}" eliminado`);
      _renderProductos?.();
    }
  );
}

/* ============================================
   PÁGINA: CATEGORÍAS
   ============================================ */
let _catEditId      = null;
let _renderCategorias = null;

function initCategorias() {
  if (!document.getElementById('page-categorias')) return;

  async function render() {
    try {
      const [cats, prods] = await Promise.all([DATA.getCategorias(), DATA.getProductos()]);

      document.getElementById('categorias-count').textContent =
        `${cats.length} categoría${cats.length !== 1 ? 's' : ''}`;

      const tbody = document.getElementById('categorias-tbody');
      if (!cats.length) {
        tbody.innerHTML = `<tr><td colspan="7" class="tabla-vacia">
          <div class="tabla-vacia-icon">🗂️</div><p>No hay categorías</p></td></tr>`;
        return;
      }

      tbody.innerHTML = cats.map(c => {
        // cantidad_productos viene del API; en localStorage contamos manualmente
        const cant = c.cantidad_productos !== undefined
          ? Number(c.cantidad_productos)
          : prods.filter(p => (p.categoria_id || p.categoria) === c.id).length;

        return `
          <tr>
            <td class="emoji-cell">${c.icono}</td>
            <td><strong>${c.nombre}</strong></td>
            <td><code style="background:#f1f5f9;padding:2px 7px;border-radius:5px;font-size:12px">${c.id}</code></td>
            <td class="truncate text-muted">${c.descripcion || '—'}</td>
            <td><span class="badge badge-${cant > 0 ? 'activo' : 'sin'}">${cant} producto${cant !== 1 ? 's' : ''}</span></td>
            <td><span class="badge badge-${c.activo !== false ? 'activo' : 'inactivo'}">${c.activo !== false ? 'Activa' : 'Inactiva'}</span></td>
            <td>
              <div class="d-flex gap-8">
                <button class="btn btn-outline btn-sm btn-icon" title="Editar"   data-edit="${c.id}">✏️</button>
                <button class="btn btn-danger  btn-sm btn-icon" title="Eliminar" data-del="${c.id}">🗑</button>
              </div>
            </td>
          </tr>`;
      }).join('');

      tbody.querySelectorAll('[data-edit]').forEach(btn =>
        btn.addEventListener('click', () => abrirModalCategoria(btn.dataset.edit))
      );
      tbody.querySelectorAll('[data-del]').forEach(btn =>
        btn.addEventListener('click', () => confirmarEliminarCategoria(btn.dataset.del))
      );
    } catch (err) {
      toast('Error al cargar categorías: ' + err.message, 'error');
    }
  }

  document.getElementById('btn-nueva-categoria')?.addEventListener('click', () => abrirModalCategoria(null));
  _renderCategorias = render;
  render();
}

async function abrirModalCategoria(id = null) {
  _catEditId    = id;
  const es_nueva = id === null;

  document.getElementById('modal-cat-titulo').textContent  = es_nueva ? '➕ Nueva Categoría' : '✏️ Editar Categoría';
  document.getElementById('modal-cat-guardar').textContent = es_nueva ? 'Crear categoría' : 'Guardar cambios';
  document.getElementById('cat-id-grupo').style.display    = es_nueva ? 'block' : 'none';

  const form = document.getElementById('form-categoria');
  form.reset();
  document.getElementById('cat-emoji-preview').textContent = '📦';

  if (!es_nueva) {
    try {
      const c = await DATA.getCategoria(id);
      if (!c) { toast('Categoría no encontrada', 'error'); return; }
      form.elements['nombre'].value       = c.nombre;
      form.elements['icono'].value        = c.icono;
      form.elements['descripcion'].value  = c.descripcion || '';
      form.elements['activo'].checked     = c.activo !== false;
      document.getElementById('cat-emoji-preview').textContent = c.icono;
    } catch (err) {
      toast('Error al cargar categoría: ' + err.message, 'error');
      return;
    }
  }

  abrirModal('modal-categoria-overlay');
  form.elements['nombre']?.focus();
}

async function guardarCategoria(e) {
  e.preventDefault();
  const form = e.target;

  const datos = {
    nombre:      form.elements['nombre'].value.trim(),
    icono:       form.elements['icono'].value.trim() || '📦',
    descripcion: form.elements['descripcion'].value.trim(),
    activo:      form.elements['activo'].checked,
  };

  if (!datos.nombre) { toast('El nombre es obligatorio', 'error'); return; }

  const btnGuardar = document.getElementById('modal-cat-guardar');
  btnGuardar.disabled = true;
  btnGuardar.textContent = 'Guardando…';

  try {
    if (_catEditId === null) {
      const idInput = form.elements['id']?.value.trim();
      const autoId  = idInput
        || datos.nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const resultado = await DATA.addCategoria({ ...datos, id: autoId });
      if (!resultado) { toast(`El ID "${autoId}" ya existe`, 'error'); return; }
      toast(`✅ Categoría "${datos.nombre}" creada`);
    } else {
      await DATA.updateCategoria(_catEditId, datos);
      toast(`✅ Categoría "${datos.nombre}" actualizada`);
    }
    cerrarModal('modal-categoria-overlay');
    _renderCategorias?.();
  } catch (err) {
    toast(err.message || 'Error al guardar', 'error');
  } finally {
    btnGuardar.disabled = false;
    btnGuardar.textContent = _catEditId === null ? 'Crear categoría' : 'Guardar cambios';
  }
}

async function confirmarEliminarCategoria(id) {
  let c, prods;
  try {
    [c, prods] = await Promise.all([DATA.getCategoria(id), DATA.getProductos()]);
  } catch (err) {
    toast(err.message || 'Error al obtener datos', 'error');
    return;
  }
  if (!c) return;

  const cant = prods.filter(p => (p.categoria_id || p.categoria) === id).length;
  if (cant > 0) {
    toast(`No se puede eliminar: tiene ${cant} producto${cant !== 1 ? 's' : ''} asociado${cant !== 1 ? 's' : ''}`, 'warn');
    return;
  }

  confirmar(
    'Eliminar categoría',
    `¿Seguro que deseas eliminar la categoría "${c.nombre}"? Esta acción no se puede deshacer.`,
    async () => {
      try {
        const ok = await DATA.deleteCategoria(id);
        if (ok !== false) {
          toast(`🗑 Categoría "${c.nombre}" eliminada`);
          _renderCategorias?.();
        }
      } catch (err) {
        toast(err.message || 'Error al eliminar', 'error');
      }
    }
  );
}

/* ============================================
   PÁGINA: LOGIN
   ============================================ */
function initLogin() {
  if (!document.getElementById('login-form')) return;
  if (AUTH.logueado()) { window.location.href = 'index.html'; return; }

  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const u = e.target.elements['usuario'].value.trim();
    const p = e.target.elements['contrasena'].value;
    const errEl = document.getElementById('login-error');

    if (AUTH.login(u, p)) {
      window.location.href = 'index.html';
    } else {
      errEl.textContent = '❌ Usuario o contraseña incorrectos.';
      errEl.classList.add('visible');
      e.target.elements['contrasena'].value = '';
      e.target.elements['contrasena'].focus();
      setTimeout(() => errEl.classList.remove('visible'), 4000);
    }
  });
}

/* ============================================
   EMOJI PREVIEW
   ============================================ */
function initEmojiPreview(inputId, previewId) {
  const input   = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!input || !preview) return;
  input.addEventListener('input', () => { preview.textContent = input.value.trim() || '📦'; });
}

/* ============================================
   INIT GENERAL
   ============================================ */
document.addEventListener('DOMContentLoaded', async () => {
  const pagina = window.location.pathname.split('/').pop().replace('.html', '');

  if (pagina === 'login') { initLogin(); return; }

  if (!AUTH.requerir()) return;

  // Verificar conexión con el backend
  await checkAPI();

  DATA.seed(); // seed localStorage (solo en modo offline)

  renderSidebar(pagina === 'index' ? 'dashboard' : pagina);
  initConfirm();

  switch (pagina) {
    case 'index':
      await initDashboard();
      break;

    case 'productos':
      initProductos();
      document.getElementById('form-producto')?.addEventListener('submit', guardarProducto);
      initEmojiPreview('prod-icono', 'emoji-preview');
      document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', cerrarModales));
      break;

    case 'categorias':
      initCategorias();
      document.getElementById('form-categoria')?.addEventListener('submit', guardarCategoria);
      initEmojiPreview('cat-icono', 'cat-emoji-preview');
      document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', cerrarModales));
      break;
  }

  // Cerrar modal al hacer clic fuera
  document.querySelectorAll('.modal-overlay').forEach(overlay =>
    overlay.addEventListener('click', e => { if (e.target === overlay) cerrarModales(); })
  );
});
