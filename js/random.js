(function() {
    // Definición del estado y constantes
    const UI = {
        containerId: 'view-aleatorio',
        storageKey: 'random_app_state',
        symbols: ['1', '2', '3', '4', '5', '6'],
        icons: {
            refresh: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`
        }
    };

    let state = {
        activeTab: 'coin',
        isAnimating: false
    };

    const render = () => {
        const view = document.getElementById(UI.containerId);
        if (!view) return;

        view.innerHTML = `
            <style>
                #view-aleatorio { font-family: 'Montserrat', sans-serif; width: 100%; }
                .random-app { display: flex; flex-direction: column; align-items: center; max-width: 450px; margin: 0 auto; }
                .tab-group { display: flex; width: 100%; border: 1px solid #000; margin-bottom: 2rem; background: #fff; }
                .tab-btn { flex: 1; padding: 12px; border: none; background: #fff; cursor: pointer; text-transform: uppercase; font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; transition: all 0.2s; font-family: inherit; }
                .tab-btn:not(:last-child) { border-right: 1px solid #000; }
                .tab-btn.active { background: #000; color: #fff; }

                /* Efecto Moneda */
                .coin-box { width: 100px; height: 100px; border: 2px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 2rem 0; font-size: 1.5rem; transition: transform 0.6s; background: #fff; }
                .coin-flipping { animation: flip 0.1s infinite linear; }
                @keyframes flip { 0% { transform: scaleX(1); } 50% { transform: scaleX(0); } 100% { transform: scaleX(1); } }

                /* Efecto Random Shadow Glitch */
                .dice-box { width: 80px; height: 80px; border: 2px solid #000; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 300; margin: 2rem 0; background: #fff; position: relative; }
                .dice-shadow-active { animation: shadowGlitch 0.15s infinite; }
                @keyframes shadowGlitch {
                    0% { box-shadow: 5px 5px 0 #000; transform: translate(-2px, -2px); }
                    25% { box-shadow: -5px 3px 0 #000; transform: translate(2px, 1px); }
                    50% { box-shadow: 2px -5px 0 #000; transform: translate(-1px, 2px); }
                    75% { box-shadow: -3px -3px 0 #000; transform: translate(1px, -1px); }
                    100% { box-shadow: 5px 5px 0 #000; transform: translate(0, 0); }
                }

                .input-area { width: 100%; padding: 12px; border: 1px solid #000; font-family: inherit; font-size: 0.8rem; margin-bottom: 1rem; outline: none; background: #fff; }
                .result-text { font-size: 1.1rem; font-weight: 300; text-transform: uppercase; letter-spacing: 2px; margin-top: 1rem; min-height: 1.5rem; }
                .list-output { width: 100%; text-align: left; margin-top: 1.5rem; border-top: 1px dashed #ccc; padding-top: 1rem; }
            </style>

            <div class="random-app">
                <h2 style="font-weight:300; letter-spacing:4px; margin-bottom:2rem; text-transform:uppercase; font-size:1rem;">Aleatoriedad</h2>
                
                <div class="tab-group" id="abc-tabs">
                    <button class="tab-btn ${state.activeTab === 'coin' ? 'active' : ''}" data-tab="coin">Moneda</button>
                    <button class="tab-btn ${state.activeTab === 'dice' ? 'active' : ''}" data-tab="dice">Dado</button>
                    <button class="tab-btn ${state.activeTab === 'teams' ? 'active' : ''}" data-tab="teams">Equipos</button>
                    <button class="tab-btn ${state.activeTab === 'order' ? 'active' : ''}" data-tab="order">Orden</button>
                </div>

                <div id="random-content" style="width:100%; display:flex; flex-direction:column; align-items:center;">
                    ${getTabHTML(state.activeTab)}
                </div>

                <button class="btn-outline" id="btn-back-global" style="display:none"></button>
            </div>`;

        attachEvents();
    };

    const getTabHTML = (tab) => {
        switch(tab) {
            case 'coin': return `<div class="coin-box" id="coin-el">?</div><button class="btn-black" id="btn-action">LANZAR MONEDA</button><div class="result-text" id="res"></div>`;
            case 'dice': return `<div class="dice-box" id="dice-el">?</div><button class="btn-black" id="btn-action">LANZAR DADO</button><div class="result-text" id="res"></div>`;
            case 'teams': return `<textarea class="input-area" id="names-input" placeholder="UN NOMBRE POR LÍNEA..." style="min-height:100px;"></textarea><input type="number" id="qty-input" value="2" min="2" class="input-area" placeholder="Nº DE EQUIPOS"><button class="btn-black" id="btn-action">GENERAR EQUIPOS</button><div id="list-res" class="list-output"></div>`;
            case 'order': return `<textarea class="input-area" id="names-input" placeholder="UN NOMBRE POR LÍNEA..." style="min-height:100px;"></textarea><button class="btn-black" id="btn-action">GENERAR ORDEN</button><div id="list-res" class="list-output"></div>`;
        }
    };

    const attachEvents = () => {
        const view = document.getElementById(UI.containerId);
        
        // Eventos de Tabs
        view.querySelectorAll('.tab-btn').forEach(btn => {
            btn.onclick = () => {
                state.activeTab = btn.dataset.tab;
                render();
            };
        });

        // Botón Volver
        document.getElementById('btn-back-global').onclick = () => {
            if (window.showView) window.showView('home');
        };

        // Lógica de Acción
        const actionBtn = document.getElementById('btn-action');
        if (!actionBtn) return;

        actionBtn.onclick = () => {
            if (state.isAnimating) return;
            executeAction();
        };
    };

    const executeAction = () => {
        state.isAnimating = true;
        const resDiv = document.getElementById('res');
        const listDiv = document.getElementById('list-res');

        if (state.activeTab === 'coin') {
            const el = document.getElementById('coin-el');
            el.classList.add('coin-flipping');
            setTimeout(() => {
                el.classList.remove('coin-flipping');
                const result = Math.random() < 0.5 ? 'CARA' : 'CRUZ';
                el.textContent = result;
                state.isAnimating = false;
            }, 600);
        } 
        else if (state.activeTab === 'dice') {
            const el = document.getElementById('dice-el');
            el.classList.add('dice-shadow-active');
            setTimeout(() => {
                el.classList.remove('dice-shadow-active');
                const result = Math.floor(Math.random() * 6) + 1;
                el.textContent = result;
                state.isAnimating = false;
            }, 600);
        }
        else if (state.activeTab === 'teams') {
            const names = document.getElementById('names-input').value.split('\n').filter(n => n.trim());
            const n = parseInt(document.getElementById('qty-input').value) || 2;
            const shuffled = [...names].sort(() => Math.random() - 0.5);
            let teams = Array.from({length: n}, () => []);
            shuffled.forEach((name, i) => teams[i % n].push(name));
            
            listDiv.innerHTML = teams.map((t, i) => `
                <div style="margin-bottom:1rem; border-left: 2px solid #000; padding-left: 10px;">
                    <strong style="font-size:0.7rem; text-transform:uppercase;">EQUIPO ${i+1}</strong>
                    <div style="font-size:0.9rem;">${t.join(', ') || '---'}</div>
                </div>
            `).join('');
            state.isAnimating = false;
        }
        else if (state.activeTab === 'order') {
            const names = document.getElementById('names-input').value.split('\n').filter(n => n.trim());
            const shuffled = [...names].sort(() => Math.random() - 0.5);
            listDiv.innerHTML = shuffled.map((n, i) => `
                <div style="padding:8px; border-bottom:1px solid #eee; font-size:0.85rem;">
                    <span style="font-weight:700; width:25px; display:inline-block;">${i+1}.</span> ${n}
                </div>
            `).join('');
            state.isAnimating = false;
        }
    };

    if (document.readyState === 'complete') render();
    else window.addEventListener('load', render);

    window.initAleatorio = render;
})();