document.getElementById('registroForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        // Obtener país por IP
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();

        data.codigo_pais = geoData.country_code;
        data.pais = geoData.country_name;

        // Enviar al backend
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
