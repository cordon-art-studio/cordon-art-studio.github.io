/* ============================================================
   CORDÓN ART STUDIO — script.js
   Galería dinámica · Typing · Modal · Tema · Preloader
   ============================================================ */

// LISTA DE OBRAS: agrega el nombre del archivo (sin extensión) y se acoplará sola.
// Nota: 'b2' no existía en img/ y 'a3' sí — corregido aquí.
const letras = ['a', 'a1', 'a3', 'b', 'c', 'c2', 'd', 'd2', 'e', 'e2', 'f', 'f2', 'g', 'g2', 'h', 'h2', 'i', 'i2', 'j', 'j2', 'k', 'k2', 'l', 'l2', 'm', 'm2', 'n', 'n1', 'n2', 'n3', 'o', 'o2', 'p', 'p2', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const galeria = document.getElementById('galeria');
const tituloElemento = document.getElementById('titulo-escrito');
const frase = "Cordón Art Gallery";
const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let index = 0;
let borrando = false;

/* ---------- 1. ESCRITURA INFINITA ---------- */
function loopEscritura() {
    tituloElemento.textContent = frase.substring(0, index);
    let vel = borrando ? 50 : 150;
    if (!borrando && index === frase.length) { vel = 3000; borrando = true; }
    else if (borrando && index === 0) { borrando = false; vel = 1000; }
    index += borrando ? -1 : 1;
    setTimeout(loopEscritura, vel);
}

function iniciarEscritura() {
    // El efecto de escritura es la identidad del sitio: corre siempre,
    // aunque el sistema tenga "reducir movimiento" activado.
    loopEscritura();
}

/* ---------- 2. CARGA DINÁMICA DE GALERÍA ---------- */
function cargarObras() {
    letras.forEach((nombre, i) => {
        const card = document.createElement('div');
        const num = String(i + 1).padStart(2, '0');
        card.className = 'card';
        card.setAttribute('role', 'button');
        card.tabIndex = 0;
        card.setAttribute('aria-label', `Ver obra ${num} a pantalla completa`);

        card.innerHTML = `
            <span class="card-num" aria-hidden="true">${num}</span>
            <img src="img/${nombre}.jpeg"
                 alt="Obra de Enrique Yovany Cordón Suazo — pieza ${num}"
                 loading="lazy" decoding="async">`;

        // Si la imagen no existe, se elimina la tarjeta completa (sin cajas fantasma)
        card.querySelector('img').addEventListener('error', () => card.remove());

        const abrir = () => abrirModal(nombre, num);
        card.addEventListener('click', abrir);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); }
        });

        galeria.appendChild(card);
    });
}

/* ---------- 3. MODAL ---------- */
const modal = document.getElementById('modal-visor');
const imgFull = document.getElementById('img-full');
const btnCerrar = modal.querySelector('.cerrar-modal');
let ultimoFoco = null;

function abrirModal(nombre, num) {
    ultimoFoco = document.activeElement;
    imgFull.src = `img/${nombre}.jpeg`;
    imgFull.alt = `Obra ${num} de Enrique Yovany Cordón Suazo — pantalla completa`;
    modal.inert = false;                       // habilitar interacción/foco
    modal.classList.add('abierto');
    document.body.classList.add('modal-abierto');
    btnCerrar.focus();
}

function cerrarModal() {
    modal.classList.remove('abierto');
    document.body.classList.remove('modal-abierto');
    modal.inert = true;                        // fuera de tab orden y lectores
    if (ultimoFoco) ultimoFoco.focus();
}

btnCerrar.addEventListener('click', cerrarModal);

// Clic fuera de la imagen
modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });

// Tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('abierto')) cerrarModal();
});

/* ---------- 4. TEMA CLARO/OSCURO (persistente) ---------- */
const btnTema = document.getElementById('theme-toggle');
const metaTheme = document.querySelector('meta[name="theme-color"]');

function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    btnTema.innerHTML = tema === 'dark'
        ? '<i class="fas fa-moon" aria-hidden="true"></i>'
        : '<i class="fas fa-sun" aria-hidden="true"></i>';
    btnTema.setAttribute('aria-label', tema === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro');
    if (metaTheme) metaTheme.content = tema === 'dark' ? '#0b0e11' : '#f8f9fa';
    try { localStorage.setItem('arte-tema', tema); } catch (e) { /* sin storage */ }
}

aplicarTema(document.documentElement.getAttribute('data-theme') || 'dark');

btnTema.addEventListener('click', () => {
    const actual = document.documentElement.getAttribute('data-theme');
    aplicarTema(actual === 'dark' ? 'light' : 'dark');
});

/* ---------- 5. PRELOADER (con red de seguridad) ---------- */
const preloader = document.getElementById('preloader-art');
let preloaderOculto = false;

function ocultarPreloader() {
    if (preloaderOculto || !preloader) return;
    preloaderOculto = true;
    preloader.classList.add('preloader-oculto');
    setTimeout(() => preloader.remove(), 1100);
}

window.addEventListener('load', () => {
    cargarObras();
    iniciarEscritura();
    setTimeout(ocultarPreloader, reducido ? 150 : 2800);
});

// Red de seguridad: si 'load' nunca se dispara (imagen colgada), la página no queda bloqueada
setTimeout(ocultarPreloader, 7000);
