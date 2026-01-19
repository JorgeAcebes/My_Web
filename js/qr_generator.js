(function() {
    const UI_ID = 'view-qr_generator';
    const STORAGE_KEY = 'qr_vcard_data_v1';
    let qrInstance = null;

    // Estado de la aplicación
    const state = {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
    };

    const start = () => {
        const container = document.getElementById(UI_ID);
        if (!container) {
            setTimeout(start, 50);
            return;
        }
        
        // Verificar que QRious esté disponible
        if (typeof QRious === 'undefined') {
            console.error('QRious library not loaded yet, retrying...');
            setTimeout(start, 100);
            return;
        }
        
        init(container);
    };

    const init = (view) => {
        loadFromStorage();
        renderGenerator(view);
    };

    // Cargar datos guardados
    const loadFromStorage = () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                Object.assign(state, data);
            }
        } catch (e) {
            console.error('Error cargando datos:', e);
        }
    };

    // Guardar en localStorage
    const saveToStorage = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Error guardando datos:', e);
        }
    };

    // Escapar para HTML
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    const renderGenerator = (view) => {
        view.innerHTML = `
            <style>
                .qr-app { max-width: 450px; margin: 0 auto; font-family: 'Montserrat', sans-serif; text-align: center; padding: 20px; }
                .app-container { border: 2px solid #000; padding: 2rem; background: #fff; }
                .input-group { margin-bottom: 1.2rem; text-align: left; }
                .input-group label { display: block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
                .input-minimal { width: 100%; padding: 12px; border: 1px solid #000; font-family: inherit; font-size: 0.9rem; box-sizing: border-box; }
                .qr-result-area { display: none; margin-top: 2rem; border-top: 1px dashed #000; padding-top: 2rem; }
                #qrcode { display: flex; justify-content: center; margin-bottom: 1.5rem; min-height: 320px; align-items: center; }
                #qrcode canvas { border: 1px solid #eee !important; }
                .btn-black { background: #000; color: #fff; border: none; padding: 15px; cursor: pointer; font-weight: 700; letter-spacing: 1px; width: 100%; transition: opacity 0.3s; font-family: inherit; font-size: 0.9rem; }
                .btn-black:hover { opacity: 0.8; }
                .btn-outline { background: #fff; color: #000; border: 1px solid #000; padding: 15px; cursor: pointer; font-weight: 700; flex: 1; transition: background 0.3s; font-family: inherit; font-size: 0.9rem; }
                .btn-outline:hover { background: #f0f0f0; }
                .btn-group { display: flex; gap: 10px; margin-top: 10px; }
                .info-box { background: #f9f9f9; border-left: 3px solid #000; padding: 15px; margin-top: 1rem; text-align: left; font-size: 0.85rem; }
                .modal-qr { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.98); z-index: 3000; align-items: center; justify-content: center; }
                .modal-content { max-width: 350px; width: 90%; text-align: center; }
                .reset-btn { background: none; border: none; text-decoration: underline; font-size: 0.7rem; opacity: 0.5; cursor: pointer; font-family: inherit; }
                .error-msg { color: #d00; font-size: 0.85rem; margin-top: 10px; padding: 10px; background: #ffe6e6; border: 1px solid #ffcccc; display: none; }
            </style>

            <div class="qr-app">
                <h2 style="font-weight:300; letter-spacing:4px; margin-bottom:2rem; text-transform:uppercase; font-size:1rem;">QR Contacto Emergencia</h2>
                <div class="app-container">
                    <div id="qr-form-section">
                        <div class="input-group">
                            <label>Tu Nombre Completo *</label>
                            <input type="text" id="in-fullName" class="input-minimal" value="${escapeHtml(state.fullName)}">
                        </div>
                        <div class="input-group">
                            <label>Teléfono de Emergencia *</label>
                            <input type="tel" id="in-phone" class="input-minimal" value="${escapeHtml(state.phone)}">
                        </div>
                        <div class="input-group">
                            <label>Correo Electrónico</label>
                            <input type="email" id="in-email" class="input-minimal" value="${escapeHtml(state.email)}>
                        </div>
                        <div class="input-group">
                            <label>Dirección</label>
                            <input type="text" id="in-address" class="input-minimal" value="${escapeHtml(state.address)}">
                        </div>
                        <div class="input-group">
                            <label>Mensaje adicional</label>
                            <textarea id="in-notes" class="input-minimal" style="height:60px" placeholder="Si encuentras este móvil, por favor contacta conmigo...">${escapeHtml(state.notes)}</textarea>
                        </div>
                        <button class="btn-black" id="btn-generate-qr">GENERAR QR</button>
                        <div class="error-msg" id="error-msg"></div>

                    </div>

                    <div id="qr-result-display" class="qr-result-area">
                        <div id="qrcode"></div>
                        <div class="btn-group">
                            <button class="btn-black" id="btn-download-qr">DESCARGAR PNG</button>
                            <button class="btn-outline" id="btn-wallpaper">FONDO PANTALLA</button>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top:2rem;">
                    <button id="btn-reset" class="reset-btn">REINICIAR</button>
                </div>

                <div id="modal-wallpaper" class="modal-qr">
                    <div class="modal-content">
                        <h3 style="font-weight:300; letter-spacing:2px; margin-bottom:2rem;">TIPO DE DISPOSITIVO</h3>
                        <button class="btn-black" id="btn-wall-mobile" style="margin-bottom:10px;">MÓVIL</button>
                        <button class="btn-black" id="btn-wall-tablet" style="margin-bottom:10px;">TABLET</button>
                        <button class="btn-outline" id="btn-wall-close" style="width:100%; margin-top:20px;">CANCELAR</button>
                    </div>
                </div>
            </div>`;
        
        attachEvents(view);
    };

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const attachEvents = (view) => {
        const get = (id) => document.getElementById(id);

        // Recoger datos del formulario
        const collectFormData = () => {
            state.fullName = removeAccents(get('in-fullName').value.trim());
            state.email = get('in-email').value.trim();
            state.phone = get('in-phone').value.trim();
            state.address = removeAccents(get('in-address').value.trim());
            state.notes = removeAccents(get('in-notes').value.trim());
        };

        // Mostrar error
        const showError = (msg) => {
            const errorDiv = get('error-msg');
            if (errorDiv) {
                errorDiv.textContent = msg;
                errorDiv.style.display = 'block';
            }
        };

        // Ocultar error
        const hideError = () => {
            const errorDiv = get('error-msg');
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
        };

        // Generar vCard correcto
        const generateVCard = () => {
            const nameParts = state.fullName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Crear vCard
            let vcard = 'BEGIN:VCARD\n';
            vcard += 'VERSION:3.0\n';
            vcard += 'FN;CHARSET=UTF-8:' + state.fullName + '\n';
            vcard += 'N;CHARSET=UTF-8:' + lastName + ';' + firstName + ';;;\n';
            
            // Teléfono de emergencia
            if (state.phone) {
                vcard += 'TEL;TYPE=CELL,VOICE:' + state.phone + '\n';
            }
            
            if (state.email) {
                vcard += 'EMAIL;TYPE=INTERNET:' + state.email + '\n';
            }
            
            if (state.address) {
                vcard += 'ADR;CHARSET=UTF-8;TYPE=HOME:;;' + state.address + ';;;;\n';
            }
            
            if (state.notes) {
                vcard += 'NOTE;CHARSET=UTF-8:Contacto de emergencia - ' + state.notes + '\n';
            } else {
                vcard += 'NOTE;CHARSET=UTF-8:Contacto de emergencia - Si encuentras este dispositivo, por favor contacta conmigo\n';
            }
            
            vcard += 'END:VCARD';
            return vcard;
        };

        // Generar QR
        const generateQR = () => {
            collectFormData();

            // Validar campos obligatorios
            if (!state.fullName) {
                showError('Por favor, introduce tu nombre completo');
                return false;
            }

            if (!state.phone) {
                showError('Por favor, introduce un teléfono de emergencia');
                return false;
            }

            try {
                const vcard = generateVCard();
                console.log('vCard generado:', vcard);

                // Limpiar contenedor
                const container = get('qrcode');
                container.innerHTML = '';

                // Crear canvas para el QR
                const canvas = document.createElement('canvas');
                canvas.id = 'qr-canvas';
                container.appendChild(canvas);

                // Generar QR con QRious 
                qrInstance = new QRious({
                    element: canvas,
                    value: vcard,
                    size: 300,
                    level: 'L',
                    foreground: '#000000',
                    background: '#ffffff'
                });

                // Guardar datos
                saveToStorage();

                // Mostrar resultado
                get('qr-result-display').style.display = 'block';
                
                // Scroll suave
                setTimeout(() => {
                    get('qr-result-display').scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 100);

                hideError();
                return true;

            } catch (error) {
                console.error('Error generando QR:', error);
                showError('Error al generar el QR: ' + error.message);
                return false;
            }
        };

        // Descargar QR
        const downloadQR = () => {
            const canvas = get('qr-canvas');
            if (!canvas) {
                showError('Primero debes generar un código QR');
                return;
            }

            try {
                const url = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.download = 'QR_Emergencia_' + state.fullName.replace(/\s/g, '_') + '.png';
                a.href = url;
                a.click();
            } catch (error) {
                showError('Error al descargar: ' + error.message);
            }
        };

        // Generar wallpaper
        const generateWallpaper = (type) => {
            const sourceCanvas = get('qr-canvas');
            if (!sourceCanvas) {
                showError('Primero debes generar un código QR');
                return;
            }

            try {
                const wallCanvas = document.createElement('canvas');
                const dims = type === 'mobile' 
                    ? { w: 1080, h: 1920 } 
                    : { w: 2048, h: 2732 };
                
                wallCanvas.width = dims.w;
                wallCanvas.height = dims.h;
                
                const ctx = wallCanvas.getContext('2d');
                
                // Fondo negro
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, dims.w, dims.h);

                // Centrar QR
                const qrSize = Math.min(dims.w, dims.h) * 0.65;
                const x = (dims.w - qrSize) / 2;
                const y = (dims.h - qrSize) / 2;
                
                ctx.drawImage(sourceCanvas, x, y, qrSize, qrSize);

                // Descargar
                const url = wallCanvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.download = 'Wallpaper_QR_Emergencia_' + type.toUpperCase() + '.png';
                a.href = url;
                a.click();

                // Cerrar modal
                get('modal-wallpaper').style.display = 'none';
            } catch (error) {
                showError('Error al generar wallpaper: ' + error.message);
            }
        };

        // Resetear todo
        const resetAll = () => {
            if (confirm('¿Seguro que quieres borrar todos los datos?')) {
                localStorage.removeItem(STORAGE_KEY);
                
                // Limpiar estado
                Object.keys(state).forEach(key => state[key] = '');
                
                // Re-renderizar
                renderGenerator(view);
            }
        };

        // Event listeners
        get('btn-generate-qr').onclick = generateQR;
        get('btn-download-qr').onclick = downloadQR;
        get('btn-wallpaper').onclick = () => get('modal-wallpaper').style.display = 'flex';
        get('btn-wall-close').onclick = () => get('modal-wallpaper').style.display = 'none';
        get('btn-wall-mobile').onclick = () => generateWallpaper('mobile');
        get('btn-wall-tablet').onclick = () => generateWallpaper('tablet');
        get('btn-reset').onclick = resetAll;
    };

    start();
})();
