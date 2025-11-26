document.getElementById('registroForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = this;
  const nombre = form.nombre.value.trim();
  const contrasena = form.contrasena.value.trim();
  const cedula = form.cedula.value.trim();
  const correo = form.correo.value.trim();
  const telefono = form.telefono.value.trim();

  // Validaciones mejoradas
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{5,50}$/;
  const contrasenaRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  const cedulaRegex = /^\d{7,10}$/;
  const correoRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const telefonoRegex = /^\d{10}$/;

  if (!nombreRegex.test(nombre)) {
    Utils.showToast('El nombre debe tener entre 5 y 50 caracteres y solo letras, espacios, ñ o acentos.', 'error');
    return;
  }

  if (!contrasenaRegex.test(contrasena)) {
    Utils.showToast('La contraseña debe ser alfanumérica, de al menos 8 caracteres, y contener al menos una letra y un número.', 'error');
    return;
  }

  if (!cedulaRegex.test(cedula)) {
    Utils.showToast('La cédula debe tener entre 7 y 10 dígitos.', 'error');
    return;
  }

  if (!correoRegex.test(correo)) {
    Utils.showToast('El correo electrónico no tiene un formato válido.', 'error');
    return;
  }

  if (!telefonoRegex.test(telefono)) {
    Utils.showToast('El teléfono debe tener exactamente 10 dígitos.', 'error');
    return;
  }

  // Si todas las validaciones pasan
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const geoRes = await fetch('https://ipapi.co/json/');
    const geoData = await geoRes.json();

    data.codigo_pais = geoData.country_code;
    data.pais = geoData.country_name;

    const res = await fetch('/registrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      Utils.showToast('Error al registrar', 'error');
      return;
    }

    Utils.showToast('Registrado correctamente', 'success');
    setTimeout(() => {
      window.location.href = '../Html/login.html';
    }, 1500);

  } catch (error) {
    console.error("❌ Error en el registro:", error);
    Utils.showToast("Error de red o del servidor", "error");
  }
});
