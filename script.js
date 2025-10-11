// ====== CONFIGURA AQUÍ LA FECHA DE LANZAMIENTO ======
const launch = new Date('2026-01-15T20:00:00+01:00'); // Madrid (CET/CEST)

// ====== CUENTA ATRÁS ======
(function countdown(){
  const dEl = document.getElementById('d');
  const hEl = document.getElementById('h');
  const mEl = document.getElementById('m');
  const sEl = document.getElementById('s');
  if(!(dEl && hEl && mEl && sEl)) return;

  const pad = n => String(n).padStart(2, '0');
  function tick(){
    const now = new Date();
    let t = launch - now;
    if (t < 0) t = 0;
    const d = Math.floor(t/86400000);
    const h = Math.floor((t%86400000)/3600000);
    const m = Math.floor((t%3600000)/60000);
    const s = Math.floor((t%60000)/1000);
    dEl.textContent = pad(d);
    hEl.textContent = pad(h);
    mEl.textContent = pad(m);
    sEl.textContent = pad(s);
  }
  tick(); setInterval(tick, 1000);
})();

// ====== MINIMIZAR Y ARRASTRAR EL CARD ======
(function () {
  const card = document.getElementById("card");
  const btn  = document.getElementById("toggleMini");
  if (!card || !btn) return;

  // Minimizar / Restaurar
  btn.addEventListener("click", (e)=>{
    e.stopPropagation();
    card.classList.toggle("mini");
    btn.setAttribute("aria-pressed", String(card.classList.contains("mini")));
  });

  // Arrastrar (ratón + táctil)
  let drag = false, sx=0, sy=0, sr=0, sb=0;

  function down(e){
    if (e.target && e.target.closest("#toggleMini")) return;
    drag = true;
    const cs = getComputedStyle(card);
    sr = parseFloat(cs.right);
    sb = parseFloat(cs.bottom);
    sx = (e.touches ? e.touches[0].clientX : e.clientX);
    sy = (e.touches ? e.touches[0].clientY : e.clientY);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    document.addEventListener("touchmove", move, {passive:false});
    document.addEventListener("touchend", up);
  }

  function move(e){
    if (!drag) return;
    e.preventDefault?.();
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    const y = (e.touches ? e.touches[0].clientY : e.clientY);
    const dx = x - sx, dy = y - sy;
    card.style.right  = Math.max(0, sr - dx) + "px";
    card.style.bottom = Math.max(0, sb - dy) + "px";
  }

  function up(){
    drag = false;
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
    document.removeEventListener("touchmove", move);
    document.removeEventListener("touchend", up);
  }

  card.addEventListener("mousedown", down);
  card.addEventListener("touchstart", down, { passive:false });

  // (Opcional) empezar minimizado en móvil:
  // if (window.matchMedia('(max-width: 640px)').matches) card.classList.add('mini');
})();
