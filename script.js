/* ==========================================================================
   ALIAR ROSARIO — Interactividad del prototipo
   JavaScript sin dependencias ni compilación (solo Lucide por CDN para íconos).
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. CONFIGURACIÓN — lo único que hace falta editar antes de publicar
     ------------------------------------------------------------------------ */
  const CONFIG = {
    // WhatsApp del coordinador en Rosario, con código de país.
    // WhatsApp Business del proyecto, con código de país (se usa en wa.me/5493417181147).
    whatsapp: '+54 9 341 718 1147',

    // Correo de contacto del proyecto (se muestra en el pie y en las preguntas frecuentes).
    email: 'proyectoalianzayrespaldo@gmail.com',

    // Endpoint que recibe las postulaciones y las reenvía al correo de contacto (FormSubmit).
    // La primera postulación dispara un correo de activación: hay que confirmarlo una sola vez.
    // Vacío = envío simulado (no se guarda ningún dato).
    formEndpoint: 'https://formsubmit.co/ajax/proyectoalianzayrespaldo@gmail.com',

    // Opcional: link de agenda (Calendly, Google Calendar, Cal.com...).
    // Vacío = el botón "Agendar" pide el turno por WhatsApp con los datos ya cargados.
    agendaUrl: '',

    // Cierre de inscripción (AAAA-MM-DD, hora de Argentina) para el contador de días.
    cierreInscripcion: '2026-12-10',
  };

  /* ------------------------------------------------------------------------
     2. UTILIDADES
     ------------------------------------------------------------------------ */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduceMotion = () => motionQuery.matches;
  const scrollBehavior = () => (reduceMotion() ? 'auto' : 'smooth');
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
  const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

  document.documentElement.classList.add('js');

  // Íconos Lucide: reemplaza <i data-lucide="..."> por SVG (también en contenido dinámico).
  const toPascal = (name) => name.replace(/(\w)(\w*)(_|-|\s*)/g, (m, a, b) => a.toUpperCase() + b.toLowerCase());
  function renderIcons(root = document) {
    const lib = window.lucide;
    if (!lib || !lib.icons || !lib.createElement) return;
    root.querySelectorAll('i[data-lucide]').forEach((el) => {
      const name = el.getAttribute('data-lucide');
      const node = lib.icons[toPascal(name)];
      if (!node) return;
      const svg = lib.createElement(node);
      svg.setAttribute('class', ['lucide', `lucide-${name}`, el.getAttribute('class') || ''].join(' ').trim());
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      el.replaceWith(svg);
    });
  }

  // Aviso breve en pantalla
  let toastTimer;
  function showToast(message) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 4200);
  }

  /* ------------------------------------------------------------------------
     3. WHATSAPP
     ------------------------------------------------------------------------ */
  const WA_DIGITS = CONFIG.whatsapp.replace(/\D/g, '');
  const WA_READY = !/x/i.test(CONFIG.whatsapp) && WA_DIGITS.length >= 10 && WA_DIGITS.length <= 15;
  const waLink = (text) => `https://wa.me/${WA_DIGITS}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

  function setWhatsApp(anchor, text) {
    if (!anchor) return;
    anchor.href = waLink(text);
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    anchor.setAttribute('data-wa-link', '');
  }

  function initWhatsApp() {
    $$('[data-wa]').forEach((a) => setWhatsApp(a, a.dataset.wa));
    $$('[data-wa-display]').forEach((el) => { el.textContent = CONFIG.whatsapp; });
    // Mientras el número no esté configurado, evitamos abrir un chat roto.
    document.addEventListener('click', (event) => {
      const link = event.target.closest('[data-wa-link]');
      if (!link || WA_READY) return;
      event.preventDefault();
      showToast('Prototipo: cargá el número de WhatsApp del coordinador en script.js (CONFIG.whatsapp) para activar este botón.');
    });
  }

  /* ------------------------------------------------------------------------
     4. ENCABEZADO, MENÚ MÓVIL Y SECCIÓN ACTIVA
     ------------------------------------------------------------------------ */
  function initHeader() {
    const header = $('#site-header');
    const announce = $('#announce');
    const navbar = $('#navbar');
    if (!header || !navbar) return;
    const desktop = window.matchMedia('(min-width: 768px)');
    const rootStyle = document.documentElement.style;

    // Mide la barra de anuncio y el menú para el "sticky" y el desplazamiento a anclas.
    const measure = () => {
      const a = announce ? announce.offsetHeight : 0;
      const n = navbar.offsetHeight;
      rootStyle.setProperty('--announce-h', `${a}px`);
      rootStyle.setProperty('--scroll-pad', `${(desktop.matches ? a + n : n) + 16}px`);
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(announce || navbar);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initMobileMenu() {
    const toggle = $('.navbar__toggle');
    const menu = $('#menu-movil');
    if (!toggle || !menu) return;
    const label = $('[data-toggle-label]', toggle);
    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Cerrar menú' : 'Abrir menú';
      menu.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => setOpen(!isOpen()));
    menu.addEventListener('click', (event) => { if (event.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen()) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener('click', (event) => {
      if (isOpen() && !event.target.closest('#navbar')) setOpen(false);
    });
    const wide = window.matchMedia('(min-width: 1100px)');
    const onWide = (event) => { if (event.matches) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
  }

  function initScrollSpy() {
    const links = $$('[data-nav-link]');
    const targets = links.map((a) => document.getElementById(a.getAttribute('href').slice(1)));
    let ticking = false;
    const spy = () => {
      ticking = false;
      const line = window.innerHeight * 0.3;
      let active = -1;
      let smallest = Infinity;
      targets.forEach((target, i) => {
        if (!target) return;
        const r = target.getBoundingClientRect();
        // Gana la sección más específica que cruza la línea (p. ej. "Ver prototipo" dentro de "Cómo funciona")
        if (r.top <= line && r.bottom > line && r.height < smallest) { active = i; smallest = r.height; }
      });
      links.forEach((a, i) => {
        a.classList.toggle('is-active', i === active);
        if (i === active) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(spy); }
    }, { passive: true });
    spy();
  }

  /* ------------------------------------------------------------------------
     5. APARICIÓN SUAVE AL HACER SCROLL
     ------------------------------------------------------------------------ */
  function initReveal() {
    const items = $$('[data-reveal]');
    if (!('IntersectionObserver' in window) || reduceMotion()) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    $$('[data-reveal-group]').forEach((group) => {
      $$(':scope > [data-reveal]', group).forEach((el, i) => {
        el.style.setProperty('--reveal-delay', `${Math.min(i, 6) * 80}ms`);
      });
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    items.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------------
     6. PROTOTIPO NAVEGABLE (4 farmacias, carrito compartido, recetas, campañas)
     ------------------------------------------------------------------------ */
  // Datos de ejemplo: productos de venta libre que NO son medicamentos.
  const PRODUCTOS = {
    protector: { nombre: 'Protector solar FPS 50', detalle: 'Emulsión · 200 ml', precio: 18900, icono: 'sun' },
    crema: { nombre: 'Crema hidratante facial', detalle: 'Piel sensible · 50 g', precio: 14500, icono: 'droplets' },
    panales: { nombre: 'Pañales talle G', detalle: 'Pack × 36', precio: 21700, icono: 'baby' },
    gel: { nombre: 'Alcohol en gel', detalle: 'Frasco · 250 ml', precio: 4200, icono: 'spray-can' },
    serum: { nombre: 'Sérum antioxidante', detalle: 'Dermocosmética · 30 ml', precio: 26400, icono: 'sparkles' },
    shampoo: { nombre: 'Shampoo neutro', detalle: 'Uso frecuente · 400 ml', precio: 7900, icono: 'bath' },
    cepillo: { nombre: 'Cepillo dental suave', detalle: 'Pack × 2', precio: 5300, icono: 'smile' },
    manos: { nombre: 'Crema de manos', detalle: 'Karité · 75 ml', precio: 6800, icono: 'hand-heart' },
  };

  // Farmacias ficticias: cada una con su color, su estilo y su vidriera.
  const FARMACIAS = [
    {
      id: 'parque', nombre: 'Farmacia Del Parque', mono: 'DP', barrio: 'Centro', distancia: '450 m',
      estado: 'Abierta hasta las 21 h', lema: 'Atención de siempre, ahora también online.',
      color: '#15803D', tint: '#ECFDF3', estilo: 'solid', slug: 'farmacia-del-parque', cercana: true,
      productos: ['protector', 'crema', 'panales', 'gel'],
    },
    {
      id: 'alameda', nombre: 'Farmacia Alameda', mono: 'AL', barrio: 'Pichincha', distancia: '1,2 km',
      estado: 'Abierta hasta las 20 h', lema: 'Dermocosmética y cuidado diario.',
      color: '#6D28D9', tint: '#F5F3FF', estilo: 'soft', slug: 'farmacia-alameda',
      productos: ['serum', 'crema', 'shampoo', 'manos'],
    },
    {
      id: 'nogal', nombre: 'Farmacia El Nogal', mono: 'EN', barrio: 'Echesortu', distancia: '2,1 km',
      estado: 'Abierta hasta las 23 h', lema: 'La farmacia de la familia, en el barrio de siempre.',
      color: '#BE123C', tint: '#FFF1F2', estilo: 'split', slug: 'farmacia-el-nogal',
      productos: ['panales', 'cepillo', 'gel', 'protector'],
    },
    {
      id: 'aromos', nombre: 'Farmacia Los Aromos', mono: 'LA', barrio: 'Fisherton', distancia: '7,4 km',
      estado: 'De turno esta noche', lema: 'De turno para todo el oeste.',
      color: '#1D4ED8', tint: '#EFF6FF', estilo: 'gradient', slug: 'farmacia-los-aromos',
      productos: ['protector', 'shampoo', 'cepillo', 'serum'],
    },
  ];
  const COSTO_ENVIO = 2500;

  function initDemo() {
    const root = $('#prototipo');
    if (!root) return;

    const byId = Object.fromEntries(FARMACIAS.map((f) => [f.id, f]));
    const tablist = $('[role="tablist"]', root);
    const tabs = $$('[role="tab"]', root);
    const tabByKey = Object.fromEntries(tabs.map((t) => [t.dataset.tab, t]));
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    const urlEl = $('[data-demo-url]', root);
    const storeEl = $('[data-store]', root);
    const cartEl = $('[data-cart]', root);
    const countEl = $('[data-cart-count]', root);
    const cartBtn = $('[data-cart-open]', root);
    const appToast = $('[data-app-toast]', root);
    const chips = $$('[data-farmacia]', root);

    let actual = FARMACIAS[0];
    let vistaCarrito = 'carrito'; // 'carrito' | 'listo'
    let ultimoPedido = [];
    let numeroPedido = 2041;
    let appToastTimer;
    const carrito = new Map(); // "farmacia:producto" -> cantidad
    const entrega = new Map(); // farmacia -> 'retiro' | 'envio'

    const sembrarCarrito = () => {
      carrito.clear();
      entrega.clear();
      carrito.set('parque:protector', 1);
      carrito.set('parque:gel', 2);
      carrito.set('alameda:serum', 1);
      entrega.set('parque', 'retiro');
      entrega.set('alameda', 'envio');
    };
    const unidades = () => Array.from(carrito.values()).reduce((a, b) => a + b, 0);
    const grupos = () => FARMACIAS
      .map((f) => ({
        f,
        items: Array.from(carrito.entries())
          .filter(([key]) => key.startsWith(`${f.id}:`))
          .map(([key, qty]) => ({ key, id: key.split(':')[1], qty })),
      }))
      .filter((g) => g.items.length);

    const setUrl = (key) => {
      const rutas = { tienda: actual.slug, carrito: 'carrito', recetas: 'recetas', campanas: 'campanas' };
      if (urlEl) urlEl.textContent = `aliarrosario.com.ar/${rutas[key]}`;
    };

    // Devuelve el foco a un control equivalente después de volver a dibujar
    const focusAfterRender = (selector, fallback) => {
      const el = (selector && $(selector, root)) || (fallback && $(fallback, root));
      if (el) el.focus({ preventScroll: true });
    };

    /* Pestañas ------------------------------------------------------------ */
    function selectTab(tab, moveFocus) {
      if (appToast) appToast.classList.remove('is-visible');
      tabs.forEach((t, i) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (moveFocus) tab.focus({ preventScroll: true });
      if (tablist && tablist.scrollWidth > tablist.clientWidth) {
        tablist.scrollTo({ left: tab.offsetLeft - 16, behavior: scrollBehavior() });
      }
      const key = tab.dataset.tab;
      setUrl(key);
      if (key === 'carrito') renderCart();
      if (key === 'recetas' && !chatPlayed) playChat();
    }

    tabs.forEach((tab) => tab.addEventListener('click', () => selectTab(tab, false)));
    tablist.addEventListener('keydown', (event) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const keys = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(event.key in keys)) return;
      event.preventDefault();
      const next = (keys[event.key] + tabs.length) % tabs.length;
      selectTab(tabs[next], true);
    });

    /* Tienda de cada farmacia -------------------------------------------- */
    function renderStore() {
      const f = actual;
      storeEl.style.setProperty('--c', f.color);
      storeEl.style.setProperty('--t', f.tint);
      storeEl.dataset.estilo = f.estilo;
      storeEl.innerHTML = `
        <div class="store__hero">
          <span class="store__mono" aria-hidden="true">${f.mono}</span>
          <div class="store__id">
            <p class="store__name">${f.nombre}</p>
            <p class="store__meta">${f.barrio} · a ${f.distancia} de tu dirección</p>
          </div>
          ${f.cercana ? '<span class="store__badge">Más cercana</span>' : ''}
        </div>
        <div class="store__info">
          <span class="store__status"><span class="status-dot" aria-hidden="true"></span>${f.estado}</span>
          <span class="store__tagline">“${f.lema}”</span>
        </div>
        <div class="store__products">
          ${f.productos.map((id) => {
            const p = PRODUCTOS[id];
            return `
              <article class="product">
                <div class="product__img" aria-hidden="true"><i data-lucide="${p.icono}"></i></div>
                <p class="product__name">${p.nombre}</p>
                <p class="product__detail">${p.detalle}</p>
                <div class="product__foot">
                  <span class="product__price">${money.format(p.precio)}</span>
                  <button type="button" class="product__add" data-add="${id}" aria-label="Agregar ${p.nombre}">
                    <i data-lucide="plus"></i>Agregar
                  </button>
                </div>
              </article>`;
          }).join('')}
        </div>`;
      renderIcons(storeEl);
    }

    chips.forEach((chip) => chip.addEventListener('click', () => {
      actual = byId[chip.dataset.farmacia];
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      renderStore();
      setUrl('tienda');
    }));

    function showAppToast() {
      if (!appToast) return;
      const text = document.createElement('span');
      text.textContent = 'Agregado al carrito';
      const go = document.createElement('button');
      go.type = 'button';
      go.textContent = 'Ver carrito';
      go.addEventListener('click', () => {
        appToast.classList.remove('is-visible');
        selectTab(tabByKey.carrito, true);
      });
      appToast.replaceChildren(text, go);
      appToast.classList.add('is-visible');
      clearTimeout(appToastTimer);
      appToastTimer = setTimeout(() => appToast.classList.remove('is-visible'), 2800);
    }

    function updateCount(bump) {
      const n = unidades();
      countEl.textContent = String(n);
      countEl.hidden = n === 0;
      cartBtn.setAttribute('aria-label', `Ver carrito: ${plural(n, 'producto', 'productos')}`);
      if (bump && !reduceMotion()) {
        countEl.classList.remove('is-bump');
        void countEl.offsetWidth; // reinicia la animación
        countEl.classList.add('is-bump');
      }
    }

    storeEl.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-add]');
      if (!btn) return;
      const key = `${actual.id}:${btn.dataset.add}`;
      if (vistaCarrito === 'listo') { vistaCarrito = 'carrito'; }
      carrito.set(key, (carrito.get(key) || 0) + 1);
      if (!entrega.has(actual.id)) entrega.set(actual.id, 'retiro');
      updateCount(true);
      btn.classList.add('is-added');
      btn.innerHTML = '<i data-lucide="check"></i>Agregado';
      renderIcons(btn);
      clearTimeout(btn._resetTimer);
      btn._resetTimer = setTimeout(() => {
        btn.classList.remove('is-added');
        btn.innerHTML = '<i data-lucide="plus"></i>Agregar';
        renderIcons(btn);
      }, 1400);
      showAppToast();
    });

    cartBtn.addEventListener('click', () => selectTab(tabByKey.carrito, false));

    /* Carrito unificado --------------------------------------------------- */
    function renderCart() {
      if (vistaCarrito === 'listo') { renderPedidoListo(); return; }
      const lista = grupos();
      if (!lista.length) {
        cartEl.innerHTML = `
          <div class="cart-empty">
            <span class="cart-empty__icon" aria-hidden="true"><i data-lucide="shopping-basket"></i></span>
            <p class="cart__title">Tu carrito está vacío</p>
            <p>Agregá productos desde cualquier farmacia de la red.</p>
            <button type="button" class="app-btn app-btn--ghost" data-go-store><i data-lucide="store"></i>Ver farmacias</button>
          </div>`;
        renderIcons(cartEl);
        return;
      }
      let subtotal = 0;
      let envios = 0;
      const gruposHtml = lista.map(({ f, items }) => {
        const modo = entrega.get(f.id) || 'retiro';
        if (modo === 'envio') envios += COSTO_ENVIO;
        const itemsHtml = items.map(({ key, id, qty }) => {
          const p = PRODUCTOS[id];
          subtotal += p.precio * qty;
          return `
            <li class="cart-item">
              <span class="cart-item__icon" aria-hidden="true"><i data-lucide="${p.icono}"></i></span>
              <span class="cart-item__name">${p.nombre}</span>
              <span class="cart-item__price">${money.format(p.precio * qty)}</span>
              <span class="qty">
                <button type="button" data-qty="${key}" data-delta="-1" aria-label="Quitar uno: ${p.nombre}"><i data-lucide="minus"></i></button>
                <output aria-label="Cantidad de ${p.nombre}">${qty}</output>
                <button type="button" data-qty="${key}" data-delta="1" aria-label="Sumar uno: ${p.nombre}"><i data-lucide="plus"></i></button>
              </span>
            </li>`;
        }).join('');
        return `
          <div class="cart-group" role="group" style="--c:${f.color};--t:${f.tint}" aria-label="Pedido para ${f.nombre}">
            <div class="cart-group__head">
              <span class="cart-group__mono" aria-hidden="true">${f.mono}</span>
              <div>
                <p class="cart-group__name">${f.nombre}</p>
                <p class="cart-group__meta">${f.barrio} · lo prepara tu farmacia de barrio</p>
              </div>
            </div>
            <ul class="cart-items" role="list">${itemsHtml}</ul>
            <fieldset class="delivery">
              <legend class="visually-hidden">Entrega del pedido de ${f.nombre}</legend>
              <label>
                <input type="radio" name="entrega-${f.id}" value="retiro" data-entrega="${f.id}" ${modo === 'retiro' ? 'checked' : ''}>
                <span><i data-lucide="store"></i>Retiro en mostrador</span>
              </label>
              <label>
                <input type="radio" name="entrega-${f.id}" value="envio" data-entrega="${f.id}" ${modo === 'envio' ? 'checked' : ''}>
                <span><i data-lucide="truck"></i>Envío en el día</span>
              </label>
            </fieldset>
          </div>`;
      }).join('');

      const n = unidades();
      cartEl.innerHTML = `
        <div class="cart__head">
          <p class="cart__title">Tu carrito</p>
          <p class="cart__sub">${plural(n, 'producto', 'productos')} de ${plural(lista.length, 'farmacia', 'farmacias')} · un solo pedido</p>
        </div>
        <div class="cart__layout">
          <div class="cart__groups">${gruposHtml}</div>
          <div class="cart__summary">
            <div><span>Subtotal</span><span>${money.format(subtotal)}</span></div>
            <div><span>Envíos</span><span>${envios ? money.format(envios) : 'Sin cargo'}</span></div>
            <div class="cart__total"><span>Total</span><span>${money.format(subtotal + envios)}</span></div>
            <button type="button" class="app-btn" data-confirm><i data-lucide="check"></i>Confirmar pedido</button>
            <p class="cart__hint">Cada farmacia recibe su parte del pedido, ordenada y lista para preparar.</p>
          </div>
        </div>`;
      renderIcons(cartEl);
    }

    function renderPedidoListo() {
      cartEl.innerHTML = `
        <div class="cart-done">
          <span class="cart-done__icon" aria-hidden="true"><i data-lucide="package-check"></i></span>
          <p class="cart-done__title" tabindex="-1">¡Pedido enviado!</p>
          <p>Cada farmacia recibió su parte, ordenada y lista para preparar:</p>
          <ul class="cart-done__list" role="list">
            ${ultimoPedido.map(({ f, nro, modo }) => `
              <li style="--c:${f.color}">
                <span class="cart-group__mono" aria-hidden="true">${f.mono}</span>
                <span><b>${f.nombre}</b>Pedido #${nro} · ${modo === 'envio' ? 'Envío en el día' : 'Retiro en mostrador'}</span>
              </li>`).join('')}
          </ul>
          <button type="button" class="app-btn app-btn--ghost" data-reset><i data-lucide="rotate-ccw"></i>Volver a empezar</button>
        </div>`;
      renderIcons(cartEl);
    }

    cartEl.addEventListener('click', (event) => {
      const qtyBtn = event.target.closest('[data-qty]');
      if (qtyBtn) {
        const key = qtyBtn.dataset.qty;
        const delta = Number(qtyBtn.dataset.delta);
        const next = (carrito.get(key) || 0) + delta;
        if (next <= 0) carrito.delete(key);
        else carrito.set(key, next);
        updateCount(false);
        renderCart();
        focusAfterRender(`[data-qty="${key}"][data-delta="${delta}"]`, '[data-confirm], [data-go-store]');
        return;
      }
      if (event.target.closest('[data-confirm]')) {
        ultimoPedido = grupos().map(({ f }) => ({ f, nro: numeroPedido++, modo: entrega.get(f.id) || 'retiro' }));
        carrito.clear();
        vistaCarrito = 'listo';
        updateCount(false);
        renderCart();
        focusAfterRender('.cart-done__title');
        return;
      }
      if (event.target.closest('[data-go-store]')) {
        selectTab(tabByKey.tienda, true);
        return;
      }
      if (event.target.closest('[data-reset]')) {
        sembrarCarrito();
        vistaCarrito = 'carrito';
        updateCount(false);
        renderCart();
        selectTab(tabByKey.tienda, true);
      }
    });

    cartEl.addEventListener('change', (event) => {
      const radio = event.target.closest('[data-entrega]');
      if (!radio) return;
      entrega.set(radio.dataset.entrega, radio.value);
      renderCart();
      focusAfterRender(`[data-entrega="${radio.dataset.entrega}"][value="${radio.value}"]`);
    });

    /* Recetas: conversación animada -------------------------------------- */
    const chatBody = $('[data-chat]', root);
    const steps = chatBody ? $$('[data-step]', chatBody) : [];
    const typing = chatBody ? $('[data-typing]', chatBody) : null;
    let chatPlayed = false;
    let chatTimers = [];
    steps.forEach((s) => s.classList.add('is-pending'));

    function playChat() {
      chatPlayed = true;
      chatTimers.forEach(clearTimeout);
      chatTimers = [];
      steps.forEach((s) => s.classList.add('is-pending'));
      if (typing) typing.hidden = true;
      if (reduceMotion()) {
        steps.forEach((s) => s.classList.remove('is-pending'));
        return;
      }
      const show = (i) => steps[i] && steps[i].classList.remove('is-pending');
      const typingOn = () => { if (typing) typing.hidden = false; };
      const typingOff = () => { if (typing) typing.hidden = true; };
      const plan = [
        [250, () => show(0)],
        [900, typingOn],
        [2100, () => { typingOff(); show(1); }],
        [2700, typingOn],
        [3800, () => { typingOff(); show(2); }],
        [5000, () => show(3)],
        [5800, () => show(4)],
      ];
      plan.forEach(([ms, fn]) => chatTimers.push(setTimeout(fn, ms)));
    }
    const rxBtn = $('[data-rx-send]', root);
    if (rxBtn) rxBtn.addEventListener('click', playChat);

    /* Estado inicial ------------------------------------------------------ */
    sembrarCarrito();
    renderStore();
    updateCount(false);
    renderCart();
  }

  /* ------------------------------------------------------------------------
     7. BARRIOS: mapa sincronizado + preselección en el formulario
     ------------------------------------------------------------------------ */
  function elegirBarrio(nombre) {
    const form = $('#postulacion-form');
    const select = $('#f-barrio');
    if (form && select && !form.hidden) {
      select.value = nombre;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      const field = select.closest('.field');
      field.classList.remove('is-highlight');
      void field.offsetWidth;
      field.classList.add('is-highlight');
    }
    const destino = $('#postular');
    if (destino) destino.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    showToast(nombre === 'Otro barrio de Rosario'
      ? 'Te sumamos a la lista prioritaria: completá tus datos.'
      : `Elegiste ${nombre}. Completá tus datos para postularte.`);
  }

  function initBarrios() {
    const map = $('.map');
    const tiles = $$('[data-barrio]');
    const highlight = (name, on) => {
      if (!map) return;
      const pin = $$('.map__pin', map).find((p) => p.dataset.pin === name);
      map.classList.toggle('has-active', on && Boolean(pin));
      if (pin) pin.classList.toggle('is-active', on);
    };
    tiles.forEach((tile) => {
      const name = tile.dataset.barrio;
      tile.addEventListener('mouseenter', () => highlight(name, true));
      tile.addEventListener('mouseleave', () => highlight(name, false));
      tile.addEventListener('focus', () => highlight(name, true));
      tile.addEventListener('blur', () => highlight(name, false));
      tile.addEventListener('click', () => elegirBarrio(name));
    });
    if (!map) return;
    $$('.map__pin', map).forEach((pin) => {
      const name = pin.dataset.pin;
      const tile = tiles.find((t) => t.dataset.barrio === name);
      pin.addEventListener('mouseenter', () => { highlight(name, true); if (tile) tile.classList.add('is-linked'); });
      pin.addEventListener('mouseleave', () => { highlight(name, false); if (tile) tile.classList.remove('is-linked'); });
      pin.addEventListener('click', () => elegirBarrio(name));
    });
  }

  /* ------------------------------------------------------------------------
     8. FORMULARIO: validación visual + pantalla de confirmación
     ------------------------------------------------------------------------ */
  function initForm() {
    const form = $('#postulacion-form');
    if (!form) return;
    const success = $('#form-success');
    const alertEl = $('#form-alert');
    const submitBtn = $('.form__submit', form);
    const submitLabel = $('.btn__label', submitBtn);
    const summaryList = $('#summary-list');
    const btnAgendar = $('#btn-agendar');
    const btnWaAhora = $('#btn-wa-ahora');
    const btnVolver = $('#btn-volver');
    const textoBoton = submitLabel.textContent;

    const reglas = {
      nombre: (v) => {
        const t = v.trim();
        if (!t) return 'Contanos tu nombre y apellido.';
        if (t.replace(/[^\p{L}]/gu, '').length < 3) return 'Revisá el nombre: parece incompleto.';
        if (!/\s/.test(t)) return 'Sumá también tu apellido.';
        return '';
      },
      farmacia: (v) => (v.trim().length >= 2 ? '' : 'Ingresá el nombre de la farmacia.'),
      barrio: (v) => (v ? '' : 'Elegí el barrio de tu farmacia.'),
      whatsapp: (v) => {
        const digitos = v.replace(/\D/g, '');
        if (!digitos) return 'Ingresá un WhatsApp para poder contactarte.';
        if (digitos.length < 10 || digitos.length > 15) return 'Revisá el número: incluí el código de área (ej. 341 5XXXXXX).';
        return '';
      },
    };

    const campo = (name) => form.elements[name];
    const caja = (name) => $(`[data-field="${name}"]`, form);

    function pintar(name, mensaje) {
      const box = caja(name);
      const invalido = Boolean(mensaje);
      box.classList.toggle('is-invalid', invalido);
      box.classList.toggle('is-valid', !invalido);
      campo(name).setAttribute('aria-invalid', String(invalido));
      $('.field__error', box).textContent = mensaje;
    }
    const validar = (name) => {
      const mensaje = reglas[name](campo(name).value);
      pintar(name, mensaje);
      return !mensaje;
    };
    const revisarAlerta = () => {
      if (alertEl.classList.contains('is-visible') && !$('.field.is-invalid', form)) mostrarAlerta('');
    };

    Object.keys(reglas).forEach((name) => {
      const input = campo(name);
      const box = caja(name);
      input.addEventListener('blur', () => {
        if (input.value.trim() || box.dataset.touched) { box.dataset.touched = '1'; validar(name); }
      });
      input.addEventListener('input', () => {
        const mensaje = reglas[name](input.value);
        if (!mensaje) pintar(name, '');                                  // válido: check verde al instante
        else if (box.classList.contains('is-invalid')) pintar(name, mensaje); // sigue mal: actualiza el mensaje
        else box.classList.remove('is-valid');                           // escribiendo: estado neutro
        revisarAlerta();
      });
      input.addEventListener('change', () => { box.dataset.touched = '1'; validar(name); revisarAlerta(); });
    });

    function setLoading(on) {
      submitBtn.classList.toggle('is-loading', on);
      submitBtn.disabled = on;
      submitBtn.setAttribute('aria-busy', String(on));
      submitLabel.textContent = on ? 'Enviando…' : textoBoton;
    }

    function mostrarAlerta(texto) {
      alertEl.textContent = texto;
      alertEl.classList.toggle('is-visible', Boolean(texto));
    }

    function mostrarExito() {
      const envio = form.querySelector('input[name="envios"]:checked');
      const datos = {
        nombre: campo('nombre').value.trim(),
        farmacia: campo('farmacia').value.trim(),
        barrio: campo('barrio').value,
        whatsapp: campo('whatsapp').value.trim(),
        envios: envio ? envio.value : 'Sin especificar',
        sistema: campo('sistema').value.trim() || 'Sin especificar',
      };
      const filas = [
        ['Nombre', datos.nombre],
        ['Farmacia', datos.farmacia],
        ['Barrio', datos.barrio],
        ['WhatsApp', datos.whatsapp],
        ['Envíos a domicilio', datos.envios],
        ['Sistema de gestión', datos.sistema],
      ];
      summaryList.replaceChildren(...filas.map(([etiqueta, valor]) => {
        const fila = document.createElement('div');
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = etiqueta;
        dd.textContent = valor;
        fila.append(dt, dd);
        return fila;
      }));

      const presentacion = `Hola, soy ${datos.nombre} de ${datos.farmacia} (${datos.barrio}).`;
      if (CONFIG.agendaUrl) {
        btnAgendar.href = CONFIG.agendaUrl;
        btnAgendar.target = '_blank';
        btnAgendar.rel = 'noopener';
        btnAgendar.removeAttribute('data-wa-link');
      } else {
        setWhatsApp(btnAgendar, `${presentacion} Me postulé como Farmacia Fundadora de ALIAR ROSARIO y quiero agendar una visita o videollamada de 15 minutos.`);
      }
      setWhatsApp(btnWaAhora, `${presentacion} Acabo de postular mi farmacia en ALIAR ROSARIO.`);

      form.hidden = true;
      success.hidden = false;
      renderIcons(success);
      $('#form-card').scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
      $('#success-title').focus({ preventScroll: true });
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const invalidos = Object.keys(reglas).filter((name) => {
        caja(name).dataset.touched = '1';
        return !validar(name);
      });
      if (invalidos.length) {
        mostrarAlerta(invalidos.length === 1
          ? 'Revisá el campo marcado para continuar.'
          : `Revisá los ${invalidos.length} campos marcados para continuar.`);
        campo(invalidos[0]).focus();
        return;
      }
      mostrarAlerta('');
      if (form.elements._honey && form.elements._honey.value) return; // bot detectado

      setLoading(true);
      try {
        if (CONFIG.formEndpoint) {
          const respuesta = await fetch(CONFIG.formEndpoint, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' },
          });
          if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
          const datos = await respuesta.json().catch(() => ({}));
          if (String(datos.success) === 'false') throw new Error(datos.message || 'Envío rechazado');
        } else {
          await wait(reduceMotion() ? 200 : 1100); // envío simulado
        }
        mostrarExito();
      } catch (error) {
        mostrarAlerta(`No pudimos enviar tu postulación. Probá de nuevo en unos segundos o escribinos a ${CONFIG.email}.`);
      } finally {
        setLoading(false);
      }
    });

    btnVolver.addEventListener('click', () => {
      success.hidden = true;
      form.hidden = false;
      campo('nombre').focus();
    });
  }

  /* ------------------------------------------------------------------------
     9. CTA FIJA EN CELULARES + CONTADOR DE DÍAS
     ------------------------------------------------------------------------ */
  function initStickyCta() {
    const bar = $('#sticky-cta');
    const hero = $('#hero-actions');
    const destino = $('#postular');
    if (!bar || !hero || !('IntersectionObserver' in window)) return;
    let pasoElHero = false;
    let formularioVisible = false;
    const update = () => {
      const visible = pasoElHero && !formularioVisible;
      bar.classList.toggle('is-visible', visible);
      document.body.classList.toggle('has-sticky', visible);
    };
    new IntersectionObserver(([entry]) => {
      pasoElHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      update();
    }).observe(hero);
    if (destino) {
      new IntersectionObserver(([entry]) => {
        formularioVisible = entry.isIntersecting;
        update();
      }, { rootMargin: '0px 0px -25% 0px' }).observe(destino);
    }
  }

  function initCountdown() {
    const el = $('[data-countdown]');
    if (!el) return;
    let partes;
    try {
      partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit',
      }).formatToParts(new Date());
    } catch (error) {
      return;
    }
    const parte = (tipo) => Number(partes.find((p) => p.type === tipo).value);
    const hoy = Date.UTC(parte('year'), parte('month') - 1, parte('day'));
    const [y, m, d] = CONFIG.cierreInscripcion.split('-').map(Number);
    const dias = Math.round((Date.UTC(y, m - 1, d) - hoy) / 86400000);
    if (dias < 0 || Number.isNaN(dias)) return;
    el.textContent = dias === 0 ? 'Último día' : `${dias === 1 ? 'Queda' : 'Quedan'} ${plural(dias, 'día', 'días')}`;
    el.hidden = false;
  }

  /* ------------------------------------------------------------------------
     10. INICIO
     ------------------------------------------------------------------------ */
  function init() {
    renderIcons();
    initHeader();
    initMobileMenu();
    initScrollSpy();
    initReveal();
    initWhatsApp();
    initDemo();
    initBarrios();
    initForm();
    initStickyCta();
    initCountdown();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
