(function() {
    const UI = {
        containerId: 'view-headsup',
        storageKey: 'headsup_rigorous_v2',
        icons: {
            play: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
            settings: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
            trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
            home: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
        },
        defaultModes: [
            { name: 'Animales', words: 'Perro\nGato\nElefante\nLeón\nTigre\nJirafa\nMono\nCebra\nOso\nLobo\nZorro\nConejo\nCaballo\nVaca\nCerdo\nGallina\nPato\nÁguila\nBúho\nPaloma\nTiburón\nDelfín\nBallena\nPulpo\nMedusa\nSerpiente\nCocodrilo\nTortuga\nRana\nSapo\nAbeja\nMariposa\nHormiga\nEscorpion\nCaracol\nFoca\nPingüino\nKoala\nCanguro\nCamello\nLlama\nPavo Real\nCisne\nGorila\nChimpancé\nHipopótamo\nRinoceronte\nMurciélago\nTejón' },
            { name: 'Deportes', words: 'Fútbol\nBaloncesto\nTenis\nGolf\nNatación\nCiclismo\nBoxeo\nAtletismo\nVoleibol\nRugby\nHockey\nEsquí\nSnowboard\nSurf\nPádel\nBádminton\nJudo\nKarate\nTaekwondo\nGimnasia\nHípica\nAutomovilismo\nMotociclismo\nPiragüismo\nVela\nRemo\nTriatlón\nMaratón\nSenderismo\nEscalada\nParapente\nPuenting\nBalonmano\nWaterpolo\nLucha Libre\nPatinaje\nEsgrima\nTiro con Arco\nTiro Olímpico\nBillar\nDardos\nAjedrez\nFrontón\nFútbol Sala\nCricket\nBéisbol' },
            { name: 'Objetos cotidianos', words: 'Silla\nMesa\nCama\nSofá\nLámpara\nTeléfono\nLibro\nVaso\nPlato\nTenedor\nCuchillo\nCuchara\nBotella\nBolígrafo\nCuaderno\nTelevisión\nRadio\nNevera\nHorno\nMicroondas\nLavadora\nSecadora\nEspejo\nCepillo\nPeine\nToalla\nJabón\nChampú\nCrema\nParaguas\nBolso\nMochila\nGafas\nSombrero\nBufanda\nGuantes\nZapatos\nCamisa\nPantalón\nVestido\nFalda\nCalcetines\nCorbata\nCollar\nPulsera\nReloj\nLlaves\nMonedero\nGorra\nCartera' },
            { name: 'Profesiones', words: 'Médico\nEnfermero\nBombero\nPolicía\nProfesor\nCocinero\nCamarero\nFontanero\nElectricista\nCarpintero\nPescador\nAgricultor\nGanadero\nPanadero\nCarnicero\nPeluquero\nBarbero\nTaxista\nConductor\nPiloto\nAzafata\nIngeniero\nArquitecto\nAbogado\nJuez\nPeriodista\nEscritor\nActor\nCantante\nMúsico\nPintor\nEscultor\nFotógrafo\nDiseñador\nProgramador\nContable\nBanquero\nComerciante\nVendedor\nDependiente\nCajero\nRecepcionista\nSecretario\nLimpiador\nJardinero\nMecánico\nSoldado\nMarinero\nMonja' },
            { name: 'Acciones', words: 'Correr\nSaltar\nBailar\nCantar\nReír\nLlorar\nDormir\nComer\nBeber\nNadar\nVolar\nConducir\nEscribir\nLeer\nDibujar\nPintar\nCocinar\nLimpiar\nLavar\nPlanchar\nComprar\nVender\nRegalar\nAbrir\nCerrar\nSubir\nBajar\nEmpujar\nTirar\nJugar\nTrabajar\nEstudiar\nEnseñar\nAprender\nEscuchar\nHablar\nGritar\nSusurrar\nSoñar\nPensar\nRecordar\nOlvidar\nAmar\nOdiar\nBesar\nAbrazar\nSaludar\nDespedir\nGanar\nPerder' },
            { name: 'Países o Ciudades', words: 'España\nFrancia\nItalia\nPortugal\nGrecia\nMarruecos\nTurquía\nEgipto\nArgentina\nMéxico\nBrasil\nColombia\nPerú\nChile\nVenezuela\nEstados Unidos\nCanadá\nReino Unido\nAlemania\nRusia\nChina\nJapón\nIndia\nAustralia\nSudáfrica\nMadrid\nBarcelona\nValencia\nSevilla\nBilbao\nLisboa\nOporto\nParís\nRoma\nMilán\nVenecia\nAtenas\nEstambul\nEl Cairo\nNueva York\nLos Ángeles\nBuenos Aires\nRío de Janeiro\nSantiago\nLima\nBogotá\nCaracas\nSídney\nTokio\nPekín' },
            { name: 'Comidas y Bebidas', words: 'Paella\nTortilla de patatas\nHummus\nGazpacho\nSalmorejo\nFabada\nCocido\nChurros\nTapas\nPisto\nBocadillo\nLentejas\nCroquetas\nPatatas bravas\nEmpanada\nMigas\nPan con tomate\nFlan\nBrócoli\nColiflor\nBerenjena\nCalabacín\nCalabaza\nPimiento\nTomate\nPepino\nCebolla\nAjo\nZanahoria\nLechuga\nTarta de Santiago\nTurrón\nPolvorones\nVino tinto\nVino blanco\nCerveza\nTinto de verano\nAgua\nCafé\nTé\nZumo\nChampiñón\nSetas\nNaranja\nManzana\nPera\nPlátano\nUva\nMelón\nSandía\nFresa\nCereza\nCiruela\nMelocotón\nSidra' },
            { name: 'Inventos', words: 'Rueda\nImprenta\nElectricidad\nBombilla\nTeléfono\nRadio\nTelevisión\nComputadora\nInternet\nTeléfono móvil\nGPS\nAviones\nAutomóvil\nTren\nBarco de vapor\nBicicleta\nMotor\nRefrigerador\nMicroondas\nLavadora\nAspiradora\nAire acondicionado\nCalefacción\nVacunas\nPenicilina\nRayos X\nAnestesia\nMarcapasos\nPrótesis\nLentes\nTelescopio\nMicroscopio\nCámara de fotos\nCámara de video\nReloj\nCalendario\nBrújula\nMapa\nPapel\nPlástico\nVidrio\nCemento\nHormigón\nAcero\nAluminio\nPetróleo\nGas natural\nEnergía nuclear\nEnergía solar\nEnergía eólica' },
            { name: 'Familia Hernández', words: 'Paloma\nSantiago\nAbuela\nLola\nCarlos\nArmando\nPablo\nÁngela\nJorge' }
        ]
    };

    if (!document.getElementById(UI.containerId)) return;

    let state = {
        modes: [],
        settings: { timer: 60 },
        currentGame: { active: false, wordList: [], index: 0, correct: 0, passed: 0, time: 0 },
        editingIdx: -1
    };

    const init = () => {
        const saved = JSON.parse(localStorage.getItem(UI.storageKey));
        state.modes = saved?.modes || UI.defaultModes;
        state.settings = saved?.settings || { timer: 60 };
        render();
    };

    const render = () => {
        const view = document.getElementById(UI.containerId);
        view.innerHTML = `
            <style>
                .hu-app { max-width: 450px; margin: 0 auto; font-family: 'Montserrat', sans-serif; text-align: center; }
                .hu-word { font-size: 2.8rem; font-weight: 700; text-transform: uppercase; margin: 2rem 0; letter-spacing: -1px; line-height: 1; }
                .hu-timer { font-family: monospace; font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; }
                .hu-list-item { border: 1px solid #000; padding: 1rem; margin-bottom: -1px; display: flex; justify-content: space-between; align-items: center; text-align: left; }
                .btn-group { display: flex; gap: 10px; width: 100%; }
                .btn-group button { flex: 1; margin: 0; display: flex; align-items: center; justify-content: center; gap: 8px; }
                .hu-stat-box { display: flex; gap: 10px; margin: 2rem 0; }
                .hu-stat { flex: 1; border: 1px solid #000; padding: 1rem; }
                .hu-stat b { display: block; font-size: 1.5rem; }
                .hu-stat span { font-size: 0.6rem; text-transform: uppercase; opacity: 0.6; }
                
                .hu-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #fff; z-index: 3000; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; }
                .hu-overlay.active { display: flex; }
                .hu-flash { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0; transition: opacity 0.15s; z-index: 3001; }
                .confirm-overlay { display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #fff; z-index: 3005; flex-direction: column; align-items: center; justify-content: center; }
            </style>

            <div class="hu-app" id="hu-main-view">
                <h2 style="font-weight:300; letter-spacing:4px; margin-bottom:2rem; text-transform:uppercase; font-size:1rem;">Heads Up</h2>
                
                <div id="hu-screen-start">
                    <div id="hu-modes-list" style="margin-bottom: 2rem; max-height: 60vh; overflow-y: auto; border-bottom: 1px solid #000;"></div>
                    <div class="btn-group">
                        <button class="btn-black" id="hu-btn-add-mode">NUEVA CATEGORÍA</button>
                        <button class="btn-outline" id="hu-btn-settings">${UI.icons.settings}</button>
                    </div>
                </div>

                <div id="hu-screen-edit" style="display:none;">
                    <h3 style="font-size:0.8rem; margin-bottom:1rem;">CONFIGURACIÓN DE CATEGORÍA</h3>
                    <input type="text" id="hu-edit-name" class="input-minimal" placeholder="NOMBRE" style="margin-bottom:10px; width:100%; border:1px solid #000; padding:12px;">
                    <textarea id="hu-edit-words" class="input-minimal" style="width:100%; height:200px; border:1px solid #000; padding:12px; font-family:inherit; margin-bottom:1.5rem;" placeholder="PALABRAS (UNA POR LÍNEA)"></textarea>
                    <div class="btn-group">
                        <button class="btn-black" id="hu-btn-save-mode">GUARDAR</button>
                        <button class="btn-outline" id="hu-btn-cancel-edit">CANCELAR</button>
                    </div>
                </div>

                <div id="hu-screen-settings" style="display:none;">
                    <div style="text-align:left; margin-bottom:2.5rem;">
                        <label style="font-size:0.7rem; font-weight:700; display:block; margin-bottom:10px;">TIEMPO DE JUEGO (SEG)</label>
                        <input type="number" id="hu-set-timer" class="input-minimal" value="${state.settings.timer}" style="width:100%; border:1px solid #000; padding:12px;">
                    </div>
                    <div class="btn-group">
                        <button class="btn-black" id="hu-btn-save-settings">GUARDAR</button>
                        <button class="btn-outline" id="hu-btn-cancel-settings">CANCELAR</button>
                    </div>
                </div>

                <div id="hu-screen-results" style="display:none;">
                    <h3 style="font-weight:300; letter-spacing:2px;">SESIÓN FINALIZADA</h3>
                    <div class="hu-stat-box">
                        <div class="hu-stat"><b id="res-correct">0</b><span>Correctas</span></div>
                        <div class="hu-stat"><b id="res-passed">0</b><span>Omitidas</span></div>
                    </div>
                    <button class="btn-black" id="hu-btn-res-home" style="width:100%;">VOLVER AL INICIO</button>
                </div>
            </div>

            <div id="hu-game-overlay" class="hu-overlay">
                <div class="hu-flash" id="hu-flash-el"></div>
                
                <button id="hu-game-home" style="position:absolute; top:30px; left:30px; border:none; background:none; cursor:pointer; opacity:0.3;">${UI.icons.home}</button>
                
                <div class="hu-timer" id="game-timer">00</div>
                <div class="hu-word" id="game-word">PREPARADO?</div>
                
                <div style="font-size:0.6rem; opacity:0.3; text-transform:uppercase; letter-spacing:3px; position:absolute; bottom:50px;">
                    ↑ ARRIBA: OK | ↓ ABAJO: PASAR
                </div>

                <div id="hu-confirm-exit" class="confirm-overlay">
                    <p style="font-weight:700; font-size:0.8rem; margin-bottom:2rem; letter-spacing:1px;">¿ABANDONAR PARTIDA?</p>
                    <div class="btn-group" style="max-width:300px;">
                        <button class="btn-black" id="hu-confirm-yes">SÍ, SALIR</button>
                        <button class="btn-outline" id="hu-confirm-no">CONTINUAR</button>
                    </div>
                </div>
            </div>
        `;
        attachEvents();
        renderModes();
    };

    const attachEvents = () => {
        const get = (id) => document.getElementById(id);
        
        get('hu-btn-settings').onclick = () => switchView('settings');
        get('hu-btn-cancel-settings').onclick = () => switchView('start');
        get('hu-btn-add-mode').onclick = () => { state.editingIdx = -1; get('hu-edit-name').value = ''; get('hu-edit-words').value = ''; switchView('edit'); };
        get('hu-btn-cancel-edit').onclick = () => switchView('start');
        get('hu-btn-save-settings').onclick = () => { state.settings.timer = Math.max(10, parseInt(get('hu-set-timer').value) || 60); save(); switchView('start'); };
        get('hu-btn-res-home').onclick = () => switchView('start');
        
        get('hu-btn-save-mode').onclick = () => {
            const mode = { name: get('hu-edit-name').value.trim(), words: get('hu-edit-words').value.trim() };
            if (!mode.name || !mode.words) return;
            if (state.editingIdx === -1) state.modes.push(mode);
            else state.modes[state.editingIdx] = mode;
            save(); switchView('start'); renderModes();
        };

        // Salida de juego
        get('hu-game-home').onclick = () => { get('hu-confirm-exit').style.display = 'flex'; state.currentGame.paused = true; };
        get('hu-confirm-no').onclick = () => { get('hu-confirm-exit').style.display = 'none'; state.currentGame.paused = false; };
        get('hu-confirm-yes').onclick = () => { abortGame(); };

        setupGameControls();
    };

    const renderModes = () => {
        const container = document.getElementById('hu-modes-list');
        container.innerHTML = state.modes.map((m, i) => `
            <div class="hu-list-item">
                <div>
                    <div style="font-weight:700; font-size:0.75rem; text-transform:uppercase; letter-spacing:1px;">${m.name}</div>
                    <div style="font-size:0.6rem; opacity:0.4;">${m.words.split('\n').filter(v => v.trim()).length} ELEMENTOS</div>
                </div>
                <div style="display:flex; gap:15px; align-items:center;">
                    <span style="cursor:pointer;" onclick="window.hu_play(${i})">${UI.icons.play}</span>
                    <span style="cursor:pointer; opacity:0.2; font-size:0.6rem; font-weight:700;" onclick="window.hu_edit(${i})">EDIT</span>
                    <span style="cursor:pointer; opacity:0.2;" onclick="window.hu_del(${i})">${UI.icons.trash}</span>
                </div>
            </div>
        `).join('');
    };

    window.hu_play = (i) => startGame(i);
    window.hu_edit = (i) => {
        state.editingIdx = i;
        document.getElementById('hu-edit-name').value = state.modes[i].name;
        document.getElementById('hu-edit-words').value = state.modes[i].words;
        switchView('edit');
    };
    window.hu_del = (i) => { if(confirm("ELIMINAR CATEGORÍA?")) { state.modes.splice(i, 1); save(); renderModes(); } };

    const switchView = (scr) => {
        ['start', 'edit', 'settings', 'results'].forEach(s => 
            document.getElementById(`hu-screen-${s}`).style.display = (s === scr) ? 'block' : 'none');
    };

    const save = () => localStorage.setItem(UI.storageKey, JSON.stringify({ modes: state.modes, settings: state.settings }));

    const startGame = (idx) => {
        const mode = state.modes[idx];
        state.currentGame = {
            active: true, paused: false,
            wordList: mode.words.split('\n').filter(w => w.trim()).sort(() => Math.random() - 0.5),
            index: 0, correct: 0, passed: 0,
            time: state.settings.timer
        };

        document.getElementById('hu-game-overlay').classList.add('active');
        document.getElementById('hu-confirm-exit').style.display = 'none';
        document.getElementById('game-word').textContent = "PREPARADO?";
        document.getElementById('game-timer').textContent = state.currentGame.time;

        setTimeout(() => {
            if (!state.currentGame.active) return;
            document.getElementById('game-word').textContent = state.currentGame.wordList[0];
            const interval = setInterval(() => {
                if (!state.currentGame.paused) {
                    state.currentGame.time--;
                    document.getElementById('game-timer').textContent = state.currentGame.time;
                    if (state.currentGame.time <= 0) { clearInterval(interval); endGame(); }
                }
            }, 1000);
            state.currentGame.timerInterval = interval;
        }, 1200);
    };

    const endGame = () => {
        state.currentGame.active = false;
        clearInterval(state.currentGame.timerInterval);
        document.getElementById('hu-game-overlay').classList.remove('active');
        document.getElementById('res-correct').textContent = state.currentGame.correct;
        document.getElementById('res-passed').textContent = state.currentGame.passed;
        switchView('results');
    };

    const abortGame = () => {
        state.currentGame.active = false;
        clearInterval(state.currentGame.timerInterval);
        document.getElementById('hu-game-overlay').classList.remove('active');
        switchView('start');
    };

    const setupGameControls = () => {
        let startY = 0;
        const overlay = document.getElementById('hu-game-overlay');

        overlay.ontouchstart = (e) => startY = e.touches[0].clientY;
        overlay.ontouchend = (e) => {
            if (!state.currentGame.active || state.currentGame.paused) return;
            const diff = e.changedTouches[0].clientY - startY;
            if (Math.abs(diff) > 60) {
                if (diff < 0) handleAction(true); // Swipe UP -> Correcto
                else handleAction(false);         // Swipe DOWN -> Pasar
            }
        };

        document.onkeydown = (e) => {
            if (!state.currentGame.active || state.currentGame.paused) return;
            if (e.key === "ArrowUp") handleAction(true);
            if (e.key === "ArrowDown") handleAction(false);
        };
    };

    const handleAction = (isCorrect) => {
        const flash = document.getElementById('hu-flash-el');
        if (isCorrect) {
            state.currentGame.correct++;
            flash.style.background = "#fff"; // Destello Blanco (Correcto)
        } else {
            state.currentGame.passed++;
            flash.style.background = "#000"; // Destello Negro (Incorrecto)
        }
        
        flash.style.opacity = "0.4";
        setTimeout(() => flash.style.opacity = "0", 150);

        state.currentGame.index++;
        if (state.currentGame.index >= state.currentGame.wordList.length) {
            state.currentGame.wordList.sort(() => Math.random() - 0.5);
            state.currentGame.index = 0;
        }
        document.getElementById('game-word').textContent = state.currentGame.wordList[state.currentGame.index];
    };

    init();
})();