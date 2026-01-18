// MODULE_CONFIG: id único, cat (categoría), label (nombre), file (ruta js) o url (enlace externo)
const MODULE_CONFIG = [
    // Enlaces externos:
    { id: 'uam', cat: 'Física', label: 'Formularios', url: 'https://github.com/JorgeAcebes/Formularios' },
    // 
    { id: 'alfabetos', cat: 'Juegos y Ocio', label: 'Generador Alfabetos', file: 'js/alfabetos.js' },
    { id: 'renfe', cat: 'Otros', label: 'Cercanías Renfe', file: 'js/renfe.js' },
    { id: 'qr_generator', cat: 'Otros', label: 'QR Contacto', file: 'js/qr_generator.js' },
    { id: 'diccionario', cat: 'Otros', label: 'Diccionario Personal', file: 'js/diccionario.js' },
    { id: 'led', cat: 'Otros', label: 'Letrero LED', file: 'js/led.js' },
    { id: 'bingo', cat: 'Juegos y Ocio', label: 'Bingo para Conocerse', file: 'js/bingo.js' },
    { id: 'headsup', cat: 'Juegos y Ocio', label: 'Heads Up', file: 'js/headsup.js' },
    { id: 'aleatorio', cat: 'Juegos y Ocio', label: 'Random', file: 'js/random.js' },
];

// --- LÓGICA DE CARGA ---

function showView(viewId) {
    const section = document.getElementById('view-' + viewId);
    if (!section) return; 

    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    section.classList.add('active');
    window.scrollTo(0, 0);
}

const initApp = () => {
    const nav = document.getElementById('dynamic-nav');
    const viewport = document.getElementById('app-viewport');
    if (!nav || !viewport) return;

    const categories = [...new Set(MODULE_CONFIG.map(m => m.cat))];

    categories.forEach(cat => {
        const details = document.createElement('details');
        details.innerHTML = `<summary>${cat}</summary>`;
        
        MODULE_CONFIG.filter(m => m.cat === cat).forEach(m => {
            // 1. Crear elemento en el menú
            const link = document.createElement('div');
            link.className = 'item-link';
            link.textContent = m.label;
            
            link.onclick = () => {
                if (m.url) {
                    window.open(m.url, '_blank');
                } else {
                    showView(m.id);
                }
            };
            details.appendChild(link);

            // 2. Lógica para Módulos Locales (Solo si tienen propiedad 'file')
            if (m.file && m.file !== 'external') {
                // Crear sección de vista
                const section = document.createElement('section');
                section.id = `view-${m.id}`;
                section.className = 'view-section';
                viewport.appendChild(section);

                // Cargar Script
                const script = document.createElement('script');
                script.src = m.file;
                // Opcional: defer para asegurar carga ordenada
                script.defer = true;
                document.body.appendChild(script);
            }
        });
        nav.appendChild(details);
    });
};

document.addEventListener('DOMContentLoaded', initApp);