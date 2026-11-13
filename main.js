/* Above Lab · Menú en el celular y animación suave al bajar */
(function(){
  // Menú del celular
  var boton = document.querySelector('.menu-btn');
  var nav = document.getElementById('menu');
  if (boton && nav){
    boton.addEventListener('click', function(){
      var abierto = nav.classList.toggle('abierto');
      boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
    nav.addEventListener('click', function(e){
      if (e.target.closest('a')){ nav.classList.remove('abierto'); boton.setAttribute('aria-expanded','false'); }
    });
  }

  // Los bloques aparecen suavemente cuando llegan a la pantalla
  var bloques = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)){
    bloques.forEach(function(b){ b.classList.add('visible'); });
    return;
  }
  var obs = new IntersectionObserver(function(entradas){
    entradas.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, {rootMargin:'0px 0px -8% 0px'});
  bloques.forEach(function(b){ obs.observe(b); });
})();
