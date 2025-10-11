// ===== Comprobación de carga
console.log("script.js cargado");

// ===== Toggle mini =====
(function () {
  const card = document.getElementById("card");
  const btn  = document.getElementById("toggleMini");

  if (!card || !btn) {
    alert("No encuentro el card o el botón #toggleMini en el DOM.");
    return;
  }

  // Evita que el clic arrastre
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    card.classList.toggle("mini");
    btn.setAttribute("aria-pressed", String(card.classList.contains("mini")));
    console.log("Mini:", card.classList.contains("mini"));
  });

  // ===== Arrastrar (ratón + táctil simplificado) =====
  let drag = false, sx = 0, sy = 0, sr = 0, sb = 0;

  function down(e){
    if (e.target && e.target.closest("#toggleMini")) return; // si pulsas el botón, no arrastres
    drag = true;
    const cs = getComputedStyle(card);
    sr = parseFloat(cs.right);
    sb = parseFloat(cs.bottom);
    sx = (e.touches ? e.touches[0].clientX : e.clientX);
    sy = (e.touches ? e.touches[0].clientY : e.clientY);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    document.addEventListener("touchmove", move, { passive:false });
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
})();
