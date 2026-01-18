(function() {
    const UI = {
        view: document.getElementById('view-renfe'),
        storageKey: 'renfe_routes',
        // Iconos vectoriales para un acabado profesional
        icons: {
            edit: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
            plus: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
            trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`
        }
    };

    if (!UI.view) return;

    let state = JSON.parse(localStorage.getItem(UI.storageKey)) || {
        'r1': { name: 'Coslada → Vicálvaro', originValue: '100070108', originText: 'Coslada', destinationValue: '100070100', destinationText: 'Vic%C3%A1lvaro' }
    };

    const render = () => {
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/Renfe')) {
            const newPath = currentPath.replace(/\/$/, "") + "/Renfe";
            window.history.pushState({ view: 'renfe' }, '', newPath);
        }
        if (!window.location.pathname.endsWith('Renfe')){
                window.history.pushState({}, '', 'Renfe');
        }
        UI.view.innerHTML = `
            <h2 style="text-align: center; font-weight:300; letter-spacing:4px; margin-bottom:2rem; text-transform:uppercase; font-size:1.1rem;">Cercanías</h2>
            <div class="app-container" style="max-width: 400px; margin: 0 auto;">
                
                <div id="renfeButtons" style="width: 100%;"></div>
                
                <button class="btn-outline" id="btn-edit" style="width:100%; display:flex; align-items:center; justify-content:center; gap:8px; letter-spacing:1px;">
                    ${UI.icons.edit} CONFIGURAR TRAYECTOS
                </button>               
                <button class="btn-outline" id="btn-back" style="display:none"></button>
            </div>
            <div style="text-align: center" class="time-display" id="clockDisplay"></div>
            <div id="renfeModal" class="modal">
                <div style="max-width:450px; margin:2rem auto; border:1px solid var(--border); padding:2rem; background:var(--bg); box-shadow: 20px 20px 0px rgba(0,0,0,0.05);">
                    <h3 style="font-weight:700; letter-spacing:1px; margin-bottom:2rem; text-align:center; text-transform:uppercase; font-size:0.9rem;">Configuración de Rutas</h3>
                    
                    <div id="renfeRoutesList" style="margin-bottom:2rem;"></div>
                    
                    <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:2rem; padding:1.5rem; border:1px dashed #ccc;">
                        <input type="text" id="newRenfeName" placeholder="Nombre trayecto" 
                               style="width:100%; padding:10px; border:1px solid var(--border); font-family:inherit; text-transform:uppercase; font-size:0.75rem;">
                        <input type="text" id="newRenfeUrl" placeholder="URL Renfe" 
                               style="width:100%; padding:10px; border:1px solid var(--border); font-family:inherit; font-size:0.75rem;">
                        <button class="btn-black" id="btn-add" style="margin:0; display:flex; align-items:center; justify-content:center; gap:8px;">
                            ${UI.icons.plus} AÑADIR
                        </button>
                    </div>

                    <div style="display:flex; gap:10px; justify-content:center; width: 100%;">
                        <button class="btn-black" id="btn-save" style="flex:1; margin:0;">GUARDAR</button>
                        <button class="btn-outline" id="btn-close" style="flex:1; margin:0; padding:12px; font-weight:bold; font-size:0.8rem;">CERRAR</button>
                    </div>
                </div>
            </div>`;

        attachEvents();
        updateButtons();
        startClock();
    };

    const attachEvents = () => {
        document.getElementById('btn-edit').onclick = () => toggleModal(true);
        document.getElementById('btn-add').onclick = addRoute;
        document.getElementById('btn-save').onclick = saveRoutes;
        document.getElementById('btn-close').onclick = () => toggleModal(false);
        document.getElementById('btn-back').onclick = () => typeof showView === 'function' && showView('home');
    };

    const startClock = () => {
        const el = document.getElementById('clockDisplay');
        const update = () => {
            const now = new Date();
            el.textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        };
        setInterval(update, 1000);
        update();
    };

    const updateButtons = () => {
        const container = document.getElementById('renfeButtons');
        container.innerHTML = '';
        Object.values(state).forEach(route => {
            const btn = document.createElement('button');
            btn.className = 'btn-black';
            btn.textContent = route.name;
            btn.onclick = () => {
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                const d = `${day}-${month}-${year}`;
                const t = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }).replace(':', '%3A');
                const url = `https://www.renfe.com/es/es/cercanias/cercanias-madrid/horarios#/listado?tripType=station&originInputValue=${route.originValue}&originInputText=${route.originText}&destinationInputValue=${route.destinationValue}&destinationInputText=${route.destinationText}&tripPreferences=todas&whenToDepartType=1&deptDate=${d}&deptTime=${t}`;
                window.open(url, '_blank');
            };
            container.appendChild(btn);
        });
    };

    const toggleModal = (show) => {
        document.getElementById('renfeModal').classList.toggle('show', show);
        if (show) renderModalList();
    };

    const renderModalList = () => {
        const list = document.getElementById('renfeRoutesList');
        list.innerHTML = '';
        Object.entries(state).forEach(([id, route]) => {
            const div = document.createElement('div');
            div.style = "display:flex; align-items:center; gap:10px; margin-bottom:8px;";
            div.innerHTML = `
                <input type="text" value="${route.name}" 
                       style="flex:1; padding:8px; border:1px solid #eee; font-family:inherit; font-size:0.75rem; text-transform:uppercase;" 
                       id="input-${id}">
                <button style="border:none; background:none; cursor:pointer; color:#000; display:flex; align-items:center;" id="del-${id}">
                    ${UI.icons.trash}
                </button>`;
            
            div.querySelector('input').onchange = (e) => state[id].name = e.target.value.toUpperCase();
            div.querySelector(`#del-${id}`).onclick = () => { delete state[id]; renderModalList(); };
            list.appendChild(div);
        });
    };

    function addRoute() {
        const n = document.getElementById('newRenfeName');
        const u = document.getElementById('newRenfeUrl');
        try {
            const p = new URLSearchParams(new URL(u.value.replace('#', '?')).search);
            state['r' + Date.now()] = {
                name: (n.value || 'NUEVA RUTA').toUpperCase(),
                originValue: p.get('originInputValue'),
                originText: p.get('originInputText'),
                destinationValue: p.get('destinationInputValue'),
                destinationText: p.get('destinationInputText')
            };
            n.value = ''; u.value = '';
            renderModalList();
        } catch(e) { alert("ERROR: URL NO RECONOCIDA"); }
    }

    function saveRoutes() {
        localStorage.setItem(UI.storageKey, JSON.stringify(state));
        updateButtons();
        toggleModal(false);
    }

    render();
})();
