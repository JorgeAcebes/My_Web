(function() {
    const UI_ID = 'view-qr_generator';
    const storageKey = 'qr_rigorous_data_v4';

    const start = () => {
        const container = document.getElementById(UI_ID);
        if (!container) {
            setTimeout(start, 50);
            return;
        }
        init(container);
    };

    let state = JSON.parse(localStorage.getItem(storageKey)) || {
        title: 'Mi Contacto', fullName: '', email: '', phone: '', phrase1: '', phrase2: ''
    };

    let currentQRDataURL = null;

    const init = (view) => {
        const params = new URLSearchParams(window.location.search);
        const encodedData = params.get('v'); // 'v' de virtual space / variable

        if (encodedData) {
            try {
                // Decodificación del "espacio virtual"
                const decodedData = JSON.parse(atob(encodedData));
                renderContactCard(view, decodedData);
            } catch (e) {
                console.error("Error decodificando el espacio virtual", e);
                renderGenerator(view);
            }
        } else {
            renderGenerator(view);
        }
    };

    const renderGenerator = (view) => {
        view.innerHTML = `
            <style>
                .qr-app { max-width: 450px; margin: 0 auto; font-family: 'Montserrat', sans-serif; text-align: center; }
                .app-container { border: 1px solid #000; padding: 2rem; background: #fff; }
                .input-group { margin-bottom: 1.2rem; text-align: left; }
                .input-group label { display: block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
                .input-minimal { width: 100%; padding: 12px; border: 1px solid #000; font-family: inherit; font-size: 0.9rem; box-sizing: border-box; }
                .qr-result-area { display: none; margin-top: 2rem; border-top: 1px dashed #000; padding-top: 2rem; }
                #qrCanvas { width: 100% !important; height: auto !important; border: 1px solid #eee; margin-bottom: 1.5rem; }
                .btn-black { background: #000; color: #fff; border: none; padding: 15px; cursor: pointer; font-weight: 700; letter-spacing: 1px; width: 100%; }
                .btn-outline { background: #fff; color: #000; border: 1px solid #000; padding: 15px; cursor: pointer; font-weight: 700; flex: 1; }
                .btn-group { display: flex; gap: 10px; margin-top: 10px; }
                .modal-qr { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.98); z-index:3000; align-items:center; justify-content:center; }
            </style>

            <div class="qr-app">
                <h2 style="font-weight:300; letter-spacing:4px; margin-bottom:2rem; text-transform:uppercase; font-size:1rem;">Generador QR</h2>
                <div class="app-container">
                    <div id="qr-form-section">
                        <div class="input-group"><label>Título</label><input type="text" id="in-qr-title" class="input-minimal" value="${state.title}"></div>
                        <div class="input-group"><label>Nombre Completo</label><input type="text" id="in-qr-name" class="input-minimal" value="${state.fullName}"></div>
                        <div class="input-group"><label>Correo Electrónico</label><input type="email" id="in-qr-email" class="input-minimal" value="${state.email}"></div>
                        <div class="input-group"><label>Teléfono</label><input type="tel" id="in-qr-phone" class="input-minimal" value="${state.phone}"></div>
                        <div class="input-group"><label>Mensaje ES</label><textarea id="in-qr-es" class="input-minimal" style="height:60px">${state.phrase1}</textarea></div>
                        <div class="input-group"><label>Mensaje EN</label><textarea id="in-qr-en" class="input-minimal" style="height:60px">${state.phrase2}</textarea></div>
                        <button class="btn-black" id="btn-qr-generate-now">GENERAR CÓDIGO</button>
                    </div>
                    <div id="qr-result-display" class="qr-result-area">
                        <canvas id="qrCanvas"></canvas>
                        <div class="btn-group">
                            <button class="btn-black" id="btn-qr-download-png">PNG</button>
                            <button class="btn-outline" id="btn-qr-wall-modal">FONDO</button>
                        </div>
                    </div>
                </div>
                <div style="margin-top:2rem;">
                    <button id="btn-qr-reset" style="background:none; border:none; text-decoration:underline; font-size:0.7rem; opacity:0.5; cursor:pointer;">REINICIAR</button>
                </div>

                <div id="modal-wall-qr" class="modal-qr">
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

    const renderContactCard = (view, data) => {
        const cleanUrl = window.location.href.split('?')[0];
        view.innerHTML = `
            <div class="qr-app" style="padding-top:2rem">
                <div class="app-container" style="text-align:left; border-width:2px;">
                    <h2 style="font-weight:700; font-size:1.1rem; margin-bottom:1.5rem; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #000; padding-bottom:10px;">
                        ${data.title || 'CONTACTO'}
                    </h2>
                    <p style="margin-bottom:1.5rem; font-size:1rem; font-weight:400;">${data.fullName || ''}</p>
                    <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:2rem; font-size:0.8rem;">
                        ${data.email ? `<div><b>EMAIL:</b> ${data.email}</div>` : ''}
                        ${data.phone ? `<div><b>TEL:</b> ${data.phone}</div>` : ''}
                    </div>
                    ${data.phrase1 ? `<div style="padding:15px; background:#f9f9f9; border-left:2px solid #000; margin-bottom:10px; font-size:0.85rem;">${data.phrase1}</div>` : ''}
                    ${data.phrase2 ? `<div style="padding:15px; background:#f9f9f9; border-left:2px solid #000; font-size:0.85rem; opacity:0.6;">${data.phrase2}</div>` : ''}
                </div>
                <button class="btn-black" onclick="window.location.href='${cleanUrl}'" style="margin-top:2rem;">CREAR MI PROPIO QR</button>
            </div>`;
    };

    const attachEvents = (view) => {
        const get = (id) => document.getElementById(id);
        
        get('btn-qr-generate-now').onclick = async () => {
            state = {
                title: get('in-qr-title').value || 'Contacto', // Eliminado .toUpperCase()
                fullName: get('in-qr-name').value,
                email: get('in-qr-email').value,
                phone: get('in-qr-phone').value,
                phrase1: get('in-qr-es').value,
                phrase2: get('in-qr-en').value
            };
            localStorage.setItem(storageKey, JSON.stringify(state));
            await generateQRCore();
            get('qr-result-display').style.display = 'block';
            get('qr-result-display').scrollIntoView({ behavior: 'smooth' });
        };

        get('btn-qr-download-png').onclick = () => {
            const a = document.createElement('a');
            a.download = `QR_${state.fullName.replace(/\s/g, '_') || 'Contacto'}.png`;
            a.href = currentQRDataURL;
            a.click();
        };

        get('btn-qr-wall-modal').onclick = () => get('modal-wall-qr').style.display = 'flex';
        get('btn-wall-close').onclick = () => get('modal-wall-qr').style.display = 'none';
        get('btn-qr-reset').onclick = () => {
            localStorage.removeItem(storageKey);
            renderGenerator(view);
        };
        
        get('btn-wall-mobile').onclick = () => processQRWall('mobile');
        get('btn-wall-tablet').onclick = () => processQRWall('tablet');
    };

    const generateQRCore = async () => {
        const canvas = document.getElementById('qrCanvas');
        if (!canvas || typeof QRCode === 'undefined') return;

        const baseUrl = window.location.href.split('?')[0];
        
        // Empaquetado de datos en un string Base64 para crear el "espacio virtual"
        const dataPayload = btoa(JSON.stringify(state));
        const scanUrl = `${baseUrl}?v=${dataPayload}`;

        await QRCode.toCanvas(canvas, scanUrl, {
            width: 800,
            margin: 2,
            color: { dark: '#000000', light: '#ffffff' },
            errorCorrectionLevel: 'M' // Nivel medio para balancear robustez y densidad
        });
        currentQRDataURL = canvas.toDataURL();
    };

    const processQRWall = (type) => {
        const canvas = document.createElement('canvas');
        const dims = type === 'mobile' ? { w: 1080, h: 1920 } : { w: 2048, h: 2732 };
        canvas.width = dims.w; canvas.height = dims.h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, dims.w, dims.h);

        const img = new Image();
        img.onload = () => {
            const qrSize = Math.min(dims.w, dims.h) * 0.65;
            ctx.drawImage(img, (dims.w - qrSize) / 2, (dims.h - qrSize) / 2, qrSize, qrSize);
            const a = document.createElement('a');
            a.download = `WALLPAPER_QR_${type.toUpperCase()}.png`;
            a.href = canvas.toDataURL();
            a.click();
            document.getElementById('modal-wall-qr').style.display = 'none';
        };
        img.src = currentQRDataURL;
    };

    start();
})();
