/* ============================================
   COMERCIAL BUEN FE — JavaScript Principal
   ============================================ */

/* ---- Carrito (localStorage) ---- */
let carrito = JSON.parse(localStorage.getItem('cbf_carrito') || '[]');

function guardarCarrito() {
  localStorage.setItem('cbf_carrito', JSON.stringify(carrito));
  actualizarBadges();
}

function actualizarBadges() {
  const total = carrito.reduce((s, i) => s + i.cantidad, 0);
  document.querySelectorAll('.carrito-badge').forEach(b => {
    b.textContent = total;
    b.style.display = total > 0 ? 'flex' : 'none';
  });
}

function agregarAlCarrito(id, cantidad = 1) {
  const producto = PRODUCTOS.find(p => p.id === id);
  if (!producto) return;
  const existente = carrito.find(i => i.id === id);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ id: producto.id, nombre: producto.nombre, categoria: producto.categoria,
      precio: producto.precio, unidad: producto.unidad, icono: producto.icono, cantidad });
  }
  guardarCarrito();
  toast(`✅ ${producto.nombre} agregado al carrito`);
}

/* ---- Toast ---- */
function toast(mensaje) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = mensaje;
  container.appendChild(el);
  setTimeout(() => { el.style.animation = 'slideIn 0.3s ease reverse'; setTimeout(() => el.remove(), 280); }, 2800);
}

/* ---- Menú móvil ---- */
function initMenuMovil() {
  const toggle = document.getElementById('menu-toggle');
  const nav    = document.getElementById('nav-menu');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('abierto');
    toggle.textContent = open ? '✕' : '☰';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('abierto');
    toggle.textContent = '☰';
  }));
}

/* ---- Marcar enlace activo ---- */
function marcarEnlaceActivo() {
  const pagina = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    a.classList.toggle('activo', a.getAttribute('href') === pagina);
  });
}

/* ============================================
   TARJETA HTML
   ============================================ */
function tarjetaHTML(p) {
  const badge = p.badge ? `<span class="tarjeta-badge ${p.badge}">${p.badge === 'popular' ? '⭐ Popular' : p.badge === 'nuevo' ? '✨ Nuevo' : p.badge}</span>` : '';
  return `
    <article class="tarjeta-producto">
      <a href="detalle.html?id=${p.id}" class="tarjeta-imagen">
        ${badge}${p.icono}
      </a>
      <div class="tarjeta-cuerpo">
        <div class="tarjeta-categoria">${CATEGORIA_LABELS[p.categoria]}</div>
        <h3 class="tarjeta-nombre"><a href="detalle.html?id=${p.id}">${p.nombre}</a></h3>
        <p class="tarjeta-descripcion">${p.descripcion.slice(0, 90)}${p.descripcion.length > 90 ? '…' : ''}</p>
        <div class="tarjeta-pie">
          <div class="tarjeta-precio">$${p.precio.toFixed(2)} <span>/ ${p.unidad}</span></div>
          <button class="btn-agregar" data-id="${p.id}">🛒 Agregar</button>
        </div>
      </div>
    </article>`;
}

function bindAgregarBtns(container) {
  container.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', () => agregarAlCarrito(parseInt(btn.dataset.id)));
  });
}

/* ============================================
   INICIO — productos destacados
   ============================================ */
function initInicio() {
  const grid = document.getElementById('productos-destacados');
  if (!grid) return;
  const destacados = PRODUCTOS.filter(p => p.badge === 'popular');
  grid.innerHTML = destacados.map(tarjetaHTML).join('');
  bindAgregarBtns(grid);
}

/* ============================================
   CATÁLOGO
   ============================================ */
function initCatalogo() {
  const grid = document.getElementById('productos-grid');
  if (!grid) return;

  let filtroActivo = 'todos';
  let busqueda = '';
  let orden = 'defecto';

  // Pre-seleccionar categoría desde URL
  const params = new URLSearchParams(window.location.search);
  if (params.get('cat')) {
    filtroActivo = params.get('cat');
    const btn = document.querySelector(`.filtro-btn[data-cat="${filtroActivo}"]`);
    if (btn) { document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo')); btn.classList.add('activo'); }
  }

  function render() {
    let lista = [...PRODUCTOS];
    if (filtroActivo !== 'todos') lista = lista.filter(p => p.categoria === filtroActivo);
    if (busqueda) { const q = busqueda.toLowerCase(); lista = lista.filter(p => p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q)); }
    if (orden === 'precio-asc')  lista.sort((a, b) => a.precio - b.precio);
    if (orden === 'precio-desc') lista.sort((a, b) => b.precio - a.precio);
    if (orden === 'nombre')      lista.sort((a, b) => a.nombre.localeCompare(b.nombre));

    const info = document.getElementById('resultado-info');
    if (info) info.textContent = `${lista.length} ${lista.length === 1 ? 'producto' : 'productos'} encontrados`;

    if (lista.length === 0) {
      grid.innerHTML = `<div class="pagina-vacia" style="grid-column:1/-1"><div class="pagina-vacia-icono">🔍</div><h2>Sin resultados</h2><p>Prueba con otro término o categoría.</p></div>`;
    } else {
      grid.innerHTML = lista.map(tarjetaHTML).join('');
      bindAgregarBtns(grid);
    }
  }

  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      filtroActivo = btn.dataset.cat;
      render();
    });
  });

  const inputBusqueda = document.getElementById('busqueda');
  if (inputBusqueda) inputBusqueda.addEventListener('input', e => { busqueda = e.target.value; render(); });

  const selectOrden = document.getElementById('orden');
  if (selectOrden) selectOrden.addEventListener('change', e => { orden = e.target.value; render(); });

  render();
}

/* ============================================
   DETALLE
   ============================================ */
function initDetalle() {
  const wrap = document.getElementById('detalle-contenido');
  if (!wrap) return;

  const id = parseInt(new URLSearchParams(window.location.search).get('id'));
  const p  = PRODUCTOS.find(x => x.id === id);

  if (!p) {
    wrap.innerHTML = `<div class="pagina-vacia"><div class="pagina-vacia-icono">😕</div><h2>Producto no encontrado</h2><p>El producto que buscas no existe.</p><a href="catalogo.html" class="btn btn-verde">Ver Catálogo</a></div>`;
    return;
  }

  document.title = `${p.nombre} — Comercial Buen Fe`;

  const atributos = p.atributos || ['100% Natural', 'Peso exacto', 'Envío rápido', 'Empaque sellado'];

  wrap.innerHTML = `
    <div class="detalle-layout">
      <div class="detalle-imagen-area">${p.icono}</div>
      <div>
        <div class="detalle-breadcrumb">
          <a href="index.html">Inicio</a> / <a href="catalogo.html">Catálogo</a> / <span>${p.nombre}</span>
        </div>
        <div class="detalle-categoria">${CATEGORIA_LABELS[p.categoria]}</div>
        <h1 class="detalle-nombre">${p.nombre}</h1>
        <div class="detalle-rating">
          <span class="estrellas">★★★★★</span>
          <span style="font-size:13px;color:var(--texto-suave)">4.9 · 32 reseñas</span>
        </div>
        <div class="detalle-precio">$${p.precio.toFixed(2)}</div>
        <div class="detalle-precio-unidad">precio por libra</div>
        <p class="detalle-descripcion">${p.descripcion}</p>
        <div class="detalle-atributos">
          ${atributos.map(a => `<div class="atributo"><div class="atributo-icono">✓</div><span>${a}</span></div>`).join('')}
        </div>
        <div class="detalle-cantidad-label">Cantidad (lb):</div>
        <div class="detalle-cantidad-row">
          <div class="detalle-cantidad-control">
            <button class="detalle-cantidad-btn" id="btn-menos">−</button>
            <span class="detalle-cantidad-valor" id="cant-val">1</span>
            <button class="detalle-cantidad-btn" id="btn-mas">+</button>
          </div>
          <div class="detalle-precio-total">Total: <strong id="precio-total">$${p.precio.toFixed(2)}</strong></div>
        </div>
        <div class="detalle-botones">
          <button class="btn btn-verde btn-lg" id="btn-agregar-detalle">🛒 Agregar al carrito</button>
          <a href="catalogo.html" class="btn btn-outline">← Volver</a>
        </div>
      </div>
    </div>`;

  let cant = 1;
  const cantEl   = document.getElementById('cant-val');
  const totalEl  = document.getElementById('precio-total');
  function actualizarCant() { cantEl.textContent = cant; totalEl.textContent = `$${(p.precio * cant).toFixed(2)}`; }
  document.getElementById('btn-menos').addEventListener('click', () => { if (cant > 1) { cant--; actualizarCant(); } });
  document.getElementById('btn-mas').addEventListener('click',   () => { cant++; actualizarCant(); });
  document.getElementById('btn-agregar-detalle').addEventListener('click', () => agregarAlCarrito(p.id, cant));

  // Productos relacionados
  const relWrap = document.getElementById('relacionados-grid');
  if (relWrap) {
    const rel = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 4);
    relWrap.innerHTML = rel.map(tarjetaHTML).join('');
    bindAgregarBtns(relWrap);
  }
}

/* ============================================
   CARRITO
   ============================================ */
function initCarrito() {
  const contenedor = document.getElementById('carrito-contenido');
  const resumen    = document.getElementById('resumen-pedido');
  if (!contenedor) return;

  function render() {
    if (carrito.length === 0) {
      contenedor.innerHTML = `<div class="pagina-vacia"><div class="pagina-vacia-icono">🛒</div><h2>Tu carrito está vacío</h2><p>Explora nuestro catálogo y añade tus productos favoritos.</p><a href="catalogo.html" class="btn btn-verde">Ver Catálogo</a></div>`;
      if (resumen) resumen.style.display = 'none';
      return;
    }

    const subtotal = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const envio    = subtotal >= 30 ? 0 : 5.00;
    const total    = subtotal + envio;

    contenedor.innerHTML = `
      <div class="carrito-tabla">
        <div class="carrito-tabla-header">
          <span>Producto</span><span>Precio</span><span>Cantidad</span><span>Subtotal</span><span></span>
        </div>
        ${carrito.map(item => `
          <div class="carrito-item">
            <div class="carrito-producto">
              <div class="carrito-producto-icon">${item.icono}</div>
              <div>
                <div class="carrito-producto-nombre">${item.nombre}</div>
                <div class="carrito-producto-cat">${CATEGORIA_LABELS[item.categoria] || item.categoria}</div>
              </div>
            </div>
            <div class="carrito-precio-unit">$${item.precio.toFixed(2)}/${item.unidad}</div>
            <div class="cantidad-control">
              <button class="cantidad-btn" data-accion="restar" data-id="${item.id}">−</button>
              <span class="cantidad-valor">${item.cantidad}</span>
              <button class="cantidad-btn" data-accion="sumar"  data-id="${item.id}">+</button>
            </div>
            <div class="carrito-subtotal">$${(item.precio * item.cantidad).toFixed(2)}</div>
            <button class="carrito-eliminar" data-id="${item.id}" title="Eliminar">🗑</button>
          </div>`).join('')}
      </div>`;

    if (resumen) {
      resumen.style.display = 'block';
      resumen.innerHTML = `
        <h3>Resumen del pedido</h3>
        <div class="resumen-linea"><span>Subtotal (${carrito.reduce((s,i)=>s+i.cantidad,0)} productos)</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="resumen-linea"><span>Envío</span><span>${envio === 0 ? '<span style="color:var(--verde-brillante);font-weight:600">Gratis</span>' : '$' + envio.toFixed(2)}</span></div>
        ${envio > 0 ? `<p class="resumen-nota">Envío gratis en pedidos ≥ $30.00</p>` : ''}
        <div class="resumen-total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
        <button class="btn btn-verde" style="width:100%;justify-content:center;margin-top:18px" onclick="alert('¡Gracias por tu interés!\\nProximamente implementaremos el sistema de pagos en línea.\\n\\nPor ahora, contáctanos para coordinar tu pedido.')">
          Proceder al pago 🔒
        </button>
        <a href="catalogo.html" class="btn btn-outline" style="width:100%;justify-content:center;margin-top:10px">Seguir comprando</a>`;
    }

    contenedor.querySelectorAll('.cantidad-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const item = carrito.find(i => i.id === id);
        if (!item) return;
        btn.dataset.accion === 'sumar' ? item.cantidad++ : item.cantidad--;
        if (item.cantidad <= 0) carrito = carrito.filter(i => i.id !== id);
        guardarCarrito(); render();
      });
    });

    contenedor.querySelectorAll('.carrito-eliminar').forEach(btn => {
      btn.addEventListener('click', () => {
        carrito = carrito.filter(i => i.id !== parseInt(btn.dataset.id));
        guardarCarrito(); render();
        toast('Producto eliminado del carrito');
      });
    });
  }

  render();
}

/* ============================================
   CONTACTO
   ============================================ */
function initContacto() {
  const form = document.getElementById('contacto-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    toast('✅ ¡Mensaje enviado! Te responderemos pronto.');
    form.reset();
  });
}

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  actualizarBadges();
  marcarEnlaceActivo();
  initMenuMovil();
  initInicio();
  initCatalogo();
  initDetalle();
  initCarrito();
  initContacto();
});
