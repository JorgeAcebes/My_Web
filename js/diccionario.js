//Si quieres añadir más palabras, aquí:
(function() {
    const UI = {
        view: document.getElementById('view-diccionario'),
        storageKey: 'invented_dictionary',
        data: {
            "luvilar": {
                definition: "El ligero sonido que hace la lluvia al caer o rebotar contra el suelo, las ventanas, el techo u otras superficies.",
                preview: "Sonido de la lluvia al caer..."
            },
            "luvillar": {
                definition: "Un luvilar intenso, debido a fuertes lluvias o granizo.",
                preview: "Un luvilar intenso..."
            },
            "luminvacuo": {
                definition: "El ambiente causado por una iluminación más tenue en ciertos edificios públicos, típico de los meses de invierno.",
                preview: "Ambiente de iluminación tenue..."
            },
            "dentimación": {
                definition: "El arte de prolongar la vida útil de un tubo de pasta de dientes mediante presiones y maniobras diversas.",
                preview: "Acción de prolongar la pasta de dientes..."
            }
        }
    };
// 
    if (!UI.view) return;

    let state = { filter: '', currentWord: null };

    const render = () => {
        UI.view.innerHTML = `
            <style>
                .search-input { width: 100%; padding: 12px; border: 1px solid var(--border); font-family: inherit; font-size: 0.9rem; margin-bottom: 1rem; outline: none; }
                .search-input:focus { background: var(--hover-bg); }
                .word-list { display: flex; flex-direction: column; gap: 0; }
                .word-item { padding: 1rem; border: 1px solid var(--border); margin-bottom: -1px; cursor: pointer; transition: background 0.2s; text-align: left; }
                .word-item:hover { background: var(--hover-bg); }
                .word-title { font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; }
                .word-preview { font-size: 0.75rem; opacity: 0.6; margin-top: 4px; }
                .def-title { font-size: 1.5rem; font-weight: 300; letter-spacing: 3px; text-transform: lowercase; margin-bottom: 1.5rem; text-align: center; }
                .status-text { font-size: 0.7rem; opacity: 0.5; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 1px; }
            </style>
            <h2 style="text-align: center; font-weight:300; letter-spacing:4px; margin-bottom:2rem; text-transform:uppercase; font-size:1rem;">Diccionario</h2>
            <div class="app-container">
                
                <div id="dicc-main">
                    <input type="text" class="search-input" id="dicc-search" placeholder="BUSCAR PALABRA..." autocomplete="off">
                    <div class="status-text" id="dicc-count"></div>
                    <div class="word-list" id="dicc-list"></div>
                </div>

                <div id="dicc-definition" style="display:none;">
                    <div class="def-title" id="def-word"></div>
                    <p id="def-text" style="font-size: 0.95rem; margin-bottom: 2rem; text-align: justify; line-height: 1.8;"></p>
                    <button class="btn-outline" id="btn-dicc-back" style="width:100%;">← VOLVER AL LISTADO</button>
                </div>

                <button class="btn-outline" id="btn-dicc-exit" style="display:none"></button>
            </div>`;

        attachEvents();
        updateList();
    };

    const attachEvents = () => {
        const search = document.getElementById('dicc-search');
        search.oninput = (e) => {
            state.filter = e.target.value.toLowerCase();
            updateList();
        };

        // Navegación local (Dentro del módulo)
        document.getElementById('btn-dicc-back').onclick = () => switchLocalView('main');

        // Navegación global (Fuera del módulo)
        document.getElementById('btn-dicc-exit').onclick = () => {
            if (typeof window.showView === 'function') {
                window.showView('home');
            } else {
                console.error("Función global showView no encontrada.");
            }
        };
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') switchLocalView('main');
        });
    };

    const updateList = () => {
        const list = document.getElementById('dicc-list');
        const count = document.getElementById('dicc-count');
        const words = Object.keys(UI.data)
            .filter(w => w.includes(state.filter) || UI.data[w].definition.toLowerCase().includes(state.filter))
            .sort();

        count.textContent = `${words.length} DE ${Object.keys(UI.data).length} PALABRAS`;

        list.innerHTML = words.map(w => `
            <div class="word-item" onclick="window.viewWordDef('${w}')">
                <div class="word-title">${w}</div>
                <div class="word-preview">${UI.data[w].preview}</div>
            </div>
        `).join('');
    };

    // Función renombrada para evitar shadowing con la global showView
    const switchLocalView = (view) => {
        document.getElementById('dicc-main').style.display = view === 'main' ? 'block' : 'none';
        document.getElementById('dicc-definition').style.display = view === 'def' ? 'block' : 'none';
    };

    window.viewWordDef = (word) => {
        const entry = UI.data[word];
        document.getElementById('def-word').textContent = word;
        document.getElementById('def-text').textContent = entry.definition;
        switchLocalView('def');
    };

    render();
})();