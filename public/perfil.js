document.addEventListener('DOMContentLoaded', async () => {
  const userId = localStorage.getItem('usuarioId');
  if (!userId) {
    alert('Debes iniciar sesión para ver tu perfil');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`/perfil/${userId}`);
    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    document.getElementById('nombre').textContent = data.nombre;
    document.getElementById('cedula').textContent = data.cedula;
    document.getElementById('correo').textContent = data.correo;
    document.getElementById('telefono').textContent = data.telefono;
    document.getElementById('rol').textContent = data.rol;
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
  }
});
