/* Above Lab · Formulario de contacto
   Cada mensaje se guarda en dos lugares:
   1. Netlify Forms (envía el aviso por correo)
   2. Supabase, tabla "clientes_potenciales" (base de datos de clientes)
   La clave de abajo es pública a propósito: con ella la página SOLO puede
   agregar filas; no puede leer, cambiar ni borrar nada. */
(function(){
  var SUPABASE_URL = 'https://vrjcprzrejvyyhvljnsp.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_1d6FxNlpU3nlGU7BFhB3nA_JkTW_PfT';

  var form = document.querySelector('form[name="contacto"]');
  if (!form || !window.fetch) return;

  function guardarEnSupabase(d){
    var limpio = function(v){ v = (v || '').trim(); return v === '' ? null : v; };
    return fetch(SUPABASE_URL + '/rest/v1/clientes_potenciales', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        nombre: limpio(d.get('nombre')),
        negocio: limpio(d.get('negocio')),
        telefono: limpio(d.get('telefono')),
        correo: limpio(d.get('correo')),
        interes: limpio(d.get('interes')),
        mensaje: limpio(d.get('mensaje')),
        acepto_privacidad: d.get('acepto-privacidad') === 'Sí'
      })
    }).catch(function(){ /* si falla, el mensaje igual queda en Netlify */ });
  }

  function enviarANetlify(d){
    return fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(d).toString()
    });
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var boton = form.querySelector('button[type="submit"]');
    var datos = new FormData(form);
    var esRobot = (datos.get('bot-field') || '') !== '';

    boton.disabled = true;
    boton.textContent = 'Enviando…';

    var tareas = [enviarANetlify(datos)];
    if (!esRobot) tareas.push(guardarEnSupabase(datos));

    Promise.all(tareas).then(function(res){
      if (res[0] && res[0].ok){ window.location.href = '/gracias/'; }
      else { throw new Error('Netlify'); }
    }).catch(function(){
      // Si algo falla, se envía de la forma tradicional
      form.submit();
    });
  });
})();
