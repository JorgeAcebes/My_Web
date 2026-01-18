const init = () => {
    const params = new URLSearchParams(window.location.search);
    // Verificación más robusta: si hay CUALQUIER parámetro, intentamos renderizar la tarjeta
    if (params.toString().length > 0) {
        renderContactCard(Object.fromEntries(params));
    } else {
        renderGenerator();
    }
};

const generateQRCore = async () => {
    const canvas = document.getElementById('qrCanvas');
    if (!canvas || typeof QRCode === 'undefined') return;

    // Aseguramos la barra final para evitar redirecciones de GH Pages
    const path = window.location.pathname.endsWith('/') ? 
                 window.location.pathname : 
                 window.location.pathname + '/';
    const baseUrl = `${window.location.protocol}//${window.location.host}${path}`;

    // Filtramos el estado para no incluir campos vacíos (reducción de entropía)
    const cleanState = Object.fromEntries(
        Object.entries(state).filter(([_, value]) => value !== '')
    );

    const query = new URLSearchParams(cleanState).toString();
    const scanUrl = `${baseUrl}?${query}`;

    await QRCode.toCanvas(canvas, scanUrl, {
        width: 800,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'M' // 'M' es suficiente y reduce la densidad del QR
    });
    currentQRDataURL = canvas.toDataURL();
};
