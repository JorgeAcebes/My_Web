(function() {
    const UI_ID = 'view-qr_generator';
    const storageKey = 'qr_vcard_data_v1';

    const start = () => {
        const container = document.getElementById(UI_ID);
        if (!container) {
            setTimeout(start, 50);
            return;
        }
        init(container);
    };

    let state = JSON.parse(localStorage.getItem(storageKey)) || {
        fullName: '', org: '', email: '', phone: '', website: '', address: '', notes: ''
    };

    let currentQR = null;
    let currentVCard = '';

    const init = (view) => {
        renderGenerator(view);
    };

    const renderGenerator = (view) => {
        view.innerHTML = `
            <style>
                .qr-app { max-width: 450px; margin: 0 auto; font-family: 'Montserrat', sans-serif; text-align: center; }
                .app-container { border: 2px solid #000; padding: 2rem; background: #fff; }
                .input-group { margin-bottom: 1.2rem; text-align: left; }
                .input-group label { display: block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
                .input-minimal { width: 100%; padding: 12px; border: 1px solid #000; font-family: inherit; font-size: 0.9rem; box-sizing: border-box; }
                .qr-result-area { display: none; margin-top: 2rem; border-top: 1px dashed #000; padding-top: 2rem; }
                #qrcode { display: flex; justify-content: center; margin-bottom: 1.5rem; }
                #qrcode canvas, #qrcode img { border: 1px solid #eee !important; }
                .btn-black { background: #000; color: #fff; border: none; padding: 15px; cursor: pointer; font-weight: 700; letter-spacing: 1px; width: 100%; transition: opacity 0.3s; }
                .btn-black:hover { opacity: 0.8; }
                .btn-outline { background: #fff; color: #000; border: 1px solid #000; padding: 15px; cursor: pointer; font-weight: 700; flex: 1; transition: background 0.3s; }
                .btn-outline:hover { background: #f0f0f0; }
                .btn-group { display: flex; gap: 10px; margin-top: 10px; }
                .info-box { background: #f9f9f9; border-left: 3px solid #000; padding: 15px; margin-top: 1rem; text-align: left; font-size: 0.85rem; }
                .modal-qr { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.98); z-index: 3000; align-items: center; justify-content: center; }
                .reset-btn { background: none; border: none; text-decoration: underline; font-size: 0.7rem; opacity: 0.5; cursor: pointer; }
            </style>

            <div class="qr-app">
                <h2 style="font-weight:300; letter-spacing:4px; margin-bottom:2rem; text-transform:uppercase; font-size:1rem;">Generador QR - Contacto Directo</h2>
                <div class="app-container">
                    <div id="qr-form-section">
                        <div class="input-group">
                            <label>Nombre Completo *</label>
                            <input type="text" id="in-fullName" class="input-minimal" value="${state.fullName}" placeholder="Juan Pérez García">
                        </div>
                        <div class="input-group">
                            <label>Organización / Empresa</label>
                            <input type="text" id="in-org" class="input-minimal" value="${state.org}" placeholder="Mi Empresa S.L.">
                        </div>
                        <div class="input-group">
                            <label>Correo Electrónico</label>
                            <input type="email" id="in-email" class="input-minimal" value="${state.email}" placeholder="contacto@ejemplo.com">
                        </div>
                        <div class="input-group">
                            <label>Teléfono</label>
                            <input type="tel" id="in-phone" class="input-minimal" value="${state.phone}" placeholder="+34 600 123 456">
                        </div>
                        <div class="input-group">
                            <label>Sitio Web</label>
                            <input type="url" id="in-website" class="input-minimal" value="${state.website}" placeholder="https://miwebsite.com">
                        </div>
                        <div class="input-group">
                            <label>Dirección</label>
                            <input type="text" id="in-address" class="input-minimal" value="${state.address}" placeholder="Calle Principal 123, Madrid">
                        </div>
                        <div class="input-group">
                            <label>Notas adicionales</label>
                            <textarea id="in-notes" class="input-minimal" style="height:60px" placeholder="Información adicional...">${state.notes}</textarea>
                        </div>
                        <button class="btn-black" id="btn-generate-qr">GENERAR QR</button>
                        
                        <div class="info-box">
                            <strong>✨ Ventaja:</strong><br>
                            Al escanear el QR, el móvil detectará automáticamente los datos de contacto y te permitirá guardarlo directamente en tu agenda.
                        </div>
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
                    <div style="max-width:350px; width:90%; text-align:center;">
                        <h3 style="font-weight:300; letter-spacing:2px; margin-bottom:2rem;">TIPO DE DISPOSITIVO</h3>
                        <button class="btn-black" id="btn-wall-mobile" style="margin-bottom:10px;">MÓVIL (9:16)</button>
                        <button class="btn-black" id="btn-wall-tablet" style="margin-bottom:10px;">TABLET (iPad Pro)</button>
                        <button class="btn-outline" id="btn-wall-close" style="width:100%; margin-top:20px;">CANCELAR</button>
                    </div>
                </div>
            </div>`;
        
        attachEvents(view);
    };

    const attachEvents = (view) => {
        const get = (id) => document.getElementById(id);

        get('btn-generate-qr').onclick = () => {
            state = {
                fullName: get('in-fullName').value.trim(),
                org: get('in-org').value.trim(),
                email: get('in-email').value.trim(),
                phone: get('in-phone').value.trim(),
                website: get('in-website').value.trim(),
                address: get('in-address').value.trim(),
                notes: get('in-notes').value.trim()
            };

            if (!state.fullName) {
                alert('Por favor, introduce al menos tu nombre completo');
                return;
            }

            localStorage.setItem(storageKey, JSON.stringify(state));
            generateQRCode();
            get('qr-result-display').style.display = 'block';
            get('qr-result-display').scrollIntoView({ behavior: 'smooth' });
        };

        get('btn-download-qr').onclick = () => {
            const canvas = document.querySelector('#qrcode canvas');
            if (canvas) {
                const a = document.createElement('a');
                a.download = `QR_Contacto_${state.fullName.replace(/\s/g, '_')}.png`;
                a.href = canvas.toDataURL();
                a.click();
            }
        };

        get('btn-wallpaper').onclick = () => get('modal-wallpaper').style.display = 'flex';
        get('btn-wall-close').onclick = () => get('modal-wallpaper').style.display = 'none';
        
        get('btn-wall-mobile').onclick = () => generateWallpaper('mobile');
        get('btn-wall-tablet').onclick = () => generateWallpaper('tablet');

        get('btn-reset').onclick = () => {
            if (confirm('¿Seguro que quieres borrar todos los datos?')) {
                localStorage.removeItem(storageKey);
                location.reload();
            }
        };
    };

    const generateVCard = () => {
        const nameParts = state.fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        let vcard = 'BEGIN:VCARD\n';
        vcard += 'VERSION:3.0\n';
        vcard += `FN:${state.fullName}\n`;
        vcard += `N:${lastName};${firstName};;;\n`;
        if (state.org) vcard += `ORG:${state.org}\n`;
        if (state.email) vcard += `EMAIL;TYPE=INTERNET:${state.email}\n`;
        if (state.phone) vcard += `TEL;TYPE=CELL:${state.phone}\n`;
        if (state.website) vcard += `URL:${state.website}\n`;
        if (state.address) vcard += `ADR;TYPE=WORK:;;${state.address};;;;\n`;
        if (state.notes) vcard += `NOTE:${state.notes}\n`;
        vcard += 'END:VCARD';

        return vcard;
    };

    const generateQRCode = () => {
        if (typeof QRCode === 'undefined') {
            alert('Error: Librería QRCode no cargada. Asegúrate de incluir qrcode.min.js');
            return;
        }

        currentVCard = generateVCard();
        
        document.getElementById('qrcode').innerHTML = '';
        
        currentQR = new QRCode(document.getElementById('qrcode'), {
            text: currentVCard,
            width: 300,
            height: 300,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        });
    };

    const generateWallpaper = (type) => {
        const canvas = document.querySelector('#qrcode canvas');
        if (!canvas) return;

        const wallCanvas = document.createElement('canvas');
        const dims = type === 'mobile' ? { w: 1080, h: 1920 } : { w: 2048, h: 2732 };
        wallCanvas.width = dims.w;
        wallCanvas.height = dims.h;
        
        const ctx = wallCanvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, dims.w, dims.h);

        const qrSize = Math.min(dims.w, dims.h) * 0.65;
        const x = (dims.w - qrSize) / 2;
        const y = (dims.h - qrSize) / 2;
        
        ctx.drawImage(canvas, x, y, qrSize, qrSize);

        const a = document.createElement('a');
        a.download = `Wallpaper_QR_${type.toUpperCase()}.png`;
        a.href = wallCanvas.toDataURL();
        a.click();

        document.getElementById('modal-wallpaper').style.display = 'none';
    };

    start();
})();
