(function() {
    const UI = {
        view: document.getElementById('view-led'),
        storageKey: 'led_sign_config',
        colors: [
            { name: 'VERDE', hex: '#00ff00' },
            { name: 'ROJO', hex: '#ff0000' },
            { name: 'AZUL', hex: '#0066ff' },
            { name: 'AMARILLO', hex: '#ffff00' },
            { name: 'BLANCO', hex: '#ffffff' }
        ],
        icons: {
            play: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
            settings: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
        }
    };

    if (!UI.view) return;

    let state = JSON.parse(localStorage.getItem(UI.storageKey)) || {
        text: 'BIENVENIDOS',
        size: 100,
        speed: 10,
        color: '#00ff00',
        animation: 'scroll'
    };

    const render = () => {
        UI.view.innerHTML = `
            <style>
                .led-app { max-width: 450px; margin: 0 auto; font-family: 'Montserrat', sans-serif; text-align: center; }
                .input-group { margin-bottom: 1.5rem; text-align: left; }
                .input-group label { display: block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
                .input-minimal { width: 100%; padding: 12px; border: 1px solid #000; font-family: inherit; font-size: 0.9rem; outline: none; text-transform: uppercase; }
                
                .range-minimal { width: 100%; height: 2px; background: #000; appearance: none; outline: none; margin: 15px 0; }
                .range-minimal::-webkit-slider-thumb { appearance: none; width: 12px; height: 12px; background: #000; cursor: pointer; border-radius: 50%; }

                .color-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-top: 10px; }
                .color-btn { height: 30px; border: 1px solid #eee; cursor: pointer; transition: transform 0.2s; }
                .color-btn.active { border: 1px solid #000; transform: scale(1.1); }

                /* Display View */
                #led-fullscreen { 
                    display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: #000; z-index: 3000; align-items: center; overflow: hidden; 
                }
                .led-text-container { width: 100%; white-space: nowrap; }
                #led-text-output { font-weight: 900; line-height: 1; display: inline-block; }

                @keyframes led-scroll {
                    0% { transform: translateX(100vw); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes led-blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            </style>

            <div class="led-app" id="led-config-view">
                <h2 style="font-weight:300; letter-spacing:4px; margin-bottom:2rem; text-transform:uppercase; font-size:1rem;">Letrero LED</h2>
                
                <div class="app-container">
                    <div class="input-group">
                        <label>Mensaje</label>
                        <input type="text" id="led-input-text" class="input-minimal" value="${state.text}" maxlength="50">
                    </div>

                    <div class="input-group">
                        <label>Tamaño: <span id="val-size">${state.size}</span>px</label>
                        <input type="range" id="led-range-size" class="range-minimal" min="50" max="300" value="${state.size}">
                    </div>

                    <div class="input-group">
                        <label>Velocidad: <span id="val-speed">${state.speed}</span>s</label>
                        <input type="range" id="led-range-speed" class="range-minimal" min="2" max="30" value="${state.speed}">
                    </div>

                    <div class="input-group">
                        <label>Color</label>
                        <div class="color-grid" id="led-colors"></div>
                    </div>

                    <div class="input-group">
                        <label>Modo</label>
                        <select id="led-select-mode" class="input-minimal" style="background:transparent;">
                            <option value="scroll" ${state.animation === 'scroll' ? 'selected' : ''}>DESPLAZAMIENTO</option>
                            <option value="static" ${state.animation === 'static' ? 'selected' : ''}>ESTÁTICO</option>
                            <option value="blink" ${state.animation === 'blink' ? 'selected' : ''}>PARPADEO</option>
                        </select>
                    </div>

                    <button class="btn-black" id="btn-led-start" style="width:100%; margin-top:1rem; display:flex; align-items:center; justify-content:center; gap:10px;">
                        ${UI.icons.play} INICIAR LETRERO
                    </button>
                </div>

                <button class="btn-outline" id="btn-led-exit" style="display:none;"></button>
            </div>

            <div id="led-fullscreen">
                <button id="btn-led-close" style="position:fixed; top:20px; left:20px; background:rgba(255,255,255,0.1); color:#fff; border:none; padding:10px; cursor:pointer; font-family:inherit; font-size:10px; z-index:4000;">ESC / SALIR</button>
                <div class="led-text-container">
                    <div id="led-text-output"></div>
                </div>
            </div>
        `;

        attachEvents();
        renderColorPicker();
    };

    const renderColorPicker = () => {
        const container = document.getElementById('led-colors');
        container.innerHTML = UI.colors.map(c => `
            <div class="color-btn ${state.color === c.hex ? 'active' : ''}" 
                 style="background:${c.hex}" 
                 data-hex="${c.hex}"></div>
        `).join('');

        container.querySelectorAll('.color-btn').forEach(btn => {
            btn.onclick = () => {
                state.color = btn.dataset.hex;
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                saveState();
            };
        });
    };

    const attachEvents = () => {
        const get = (id) => document.getElementById(id);

        get('led-input-text').oninput = (e) => { state.text = e.target.value; saveState(); };
        
        get('led-range-size').oninput = (e) => { 
            state.size = e.target.value; 
            get('val-size').textContent = state.size;
            saveState(); 
        };

        get('led-range-speed').oninput = (e) => { 
            state.speed = e.target.value; 
            get('val-speed').textContent = state.speed;
            saveState(); 
        };

        get('led-select-mode').onchange = (e) => { state.animation = e.target.value; saveState(); };

        get('btn-led-start').onclick = startDisplay;
        get('btn-led-close').onclick = stopDisplay;
        get('btn-led-exit').onclick = () => window.showView && window.showView('home');

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') stopDisplay();
        });
    };

    const saveState = () => localStorage.setItem(UI.storageKey, JSON.stringify(state));

    const switchLocalView = (showDisplay) => {
        document.getElementById('led-config-view').style.display = showDisplay ? 'none' : 'block';
        document.getElementById('led-fullscreen').style.display = showDisplay ? 'flex' : 'none';
    };

    const startDisplay = () => {
        const out = document.getElementById('led-text-output');
        out.textContent = state.text.toUpperCase();
        out.style.color = state.color;
        out.style.fontSize = `${state.size}px`;
        
        // Configuración de animación
        out.style.animation = 'none';
        out.classList.remove('led-static');

        setTimeout(() => {
            if (state.animation === 'scroll') {
                out.style.animation = `led-scroll ${32 - state.speed}s linear infinite`;
            } else if (state.animation === 'static') {
                out.style.width = '100%';
                out.style.textAlign = 'center';
                out.style.display = 'block';
            } else if (state.animation === 'blink') {
                out.style.width = '100%';
                out.style.textAlign = 'center';
                out.style.display = 'block';
                out.style.animation = `led-blink 0.8s step-end infinite`;
            }
        }, 10);

        switchLocalView(true);
        if (UI.view.requestFullscreen) UI.view.requestFullscreen().catch(() => {});
    };

    const stopDisplay = () => {
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        switchLocalView(false);
    };

    render();
})();