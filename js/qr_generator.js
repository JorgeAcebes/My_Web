(function() {
    const UI = {
        view: document.getElementById('view-qr_generator'),
        storageKey: 'qr_rigorous_data_v4',
        icons: {
            refresh: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`,
            download: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`
        }
    };

    if (!UI.view) return;

    let state = JSON.parse(localStorage.getItem(UI.storageKey)) || {
        title: 'MI CONTACTO', fullName: '', email: '', phone: '', phrase1: '', phrase2: ''
    };

    let currentQRDataURL = null;

    const init = () => {
        const params = new URLSearchParams(window.location.search);
        // Condición de suficiencia: si la query string no está vacía, renderiza contacto
        if (params.toString().length > 0) {
            renderContactCard(Object.fromEntries(params));
        } else {
            renderGenerator();
        }
    };

    const renderGenerator = () => {
        UI.view.innerHTML = `
            <style>
                .qr-app { max-width: 450px; margin: 0 auto; font-family: 'Montserrat', sans-serif; text-align: center; }
                .app-container { border: 1px solid #000; padding: 2rem; background: #fff; }
                .input-group { margin-bottom: 1.2rem; text-align: left; }
                .input-group label { display: block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
                .input-minimal { width: 100%; padding: 12px; border: 1px solid #000; font-family: inherit; font-size: 0.9rem; outline: none; box-sizing: border-box; }
                .qr-result-area { display: none; margin-top: 2rem; border-top: 1px dashed #000; padding-top: 2rem; }
                #qrCanvas { width: 100% !important; height: auto !important; border: 1px solid #eee; margin-bottom: 1.5rem; }
                .btn-black { background: #000; color: #fff; border: none; padding: 15px; cursor: pointer; font-weight: 700; letter-spacing: 1px; transition: opacity 0.2s; }
                .btn-outline { background: #fff; color: #000; border: 1px solid #000; padding: 15px; cursor: pointer; font-weight: 700; }
                .btn-group { display: flex; gap: 10px; width: 100%; margin-top: 10px; }
                .btn-group button { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; }
                .reset-zone { margin-top: 2rem; padding-top: 1rem; }
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
                        <button class="btn-black" id="btn-qr-generate-now" style="width:100%; margin-top:1rem;">GENERAR CÓDIGO</button>
                    </div>
                    <div id="qr-result-display" class="qr-result-area">
                        <canvas id="qrCanvas"></canvas>
                        <div class="btn-group">
                            <button class="btn-black" id="btn-qr-download-png">${UI.icons.download} PNG</button>
                            <button class="btn-outline" id="btn-qr-wall-modal">FONDO</button>
                        </div>
                    </div>
                </div>
                <div class="reset-zone">
                    <button class="btn-outline" id="btn-qr-new-start" style="border:none; text-decoration:underline; font-size:0.7rem; opacity:0.5; cursor:pointer; display:none;">
                        ${UI.icons.refresh} REINICIAR
                    </button>
                </div>

                <div id="modal-wall-qr" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.98); z-index:3000; align-items:center; justify-content:center;">
                    <div style="max-width:350px; width:90%; text-align:center;">
                        <h3 style="font-weight:300; letter-spacing:2px; margin-bottom:2rem;">TIPO DE DISPOSITIVO</h3>
                        <button class="btn-black" onclick="window.processQRWall('mobile')" style="width:100%; margin-bottom:10px;">MÓVIL (9:16)</button>
                        <button class="btn-black" onclick="window.processQRWall('tablet')" style="width:100%; margin-bottom:10px;">TABLET (iPad Pro)</button>
                        <button class="btn-outline" onclick="document.getElementById('modal-wall-qr').style.display='none'" style="width:100%; margin-top:20px;">CANCELAR</button>
                    </div>
                </div>
            </div>`;
        attachEvents();
    };

    const renderContactCard = (data) => {
        UI.view.innerHTML = `
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
                <div class="reset-zone">
                    <button class="btn-black" onclick="window.location.href=window.location.pathname" style="width:100%;">CREAR MI PROPIO QR</button>
                </div>
            </div>`;
    };

    const attachEvents = () => {
        const get = (id) => document.getElementById(id);
        if (!get('btn-qr-generate-now')) return;

        get('btn-qr-generate-now').onclick = async () => {
            state = {
                title: get('in-qr-title').value.toUpperCase() || 'CONTACTO',
                fullName: get('in-qr-name').value,
                email: get('in-qr-email').value,
                phone: get('in-qr-phone').value,
                phrase1: get('in-qr-es').value,
                phrase2: get('in-qr-en').value
            };
            localStorage.setItem(UI.storageKey, JSON.stringify(state));
            await generateQRCore();
            get('qr-result-display').style.display = 'block';
            get('btn-qr-new-start').style.display = 'inline-block';
            get('qr-result-display').scrollIntoView({ behavior: 'smooth' });
        };

        get('btn-qr-download-png').onclick = () => {
            const a = document.createElement('a');
            a.download = `QR_${state.fullName.replace(/\s/g, '_') || 'Contacto'}.png`;
            a.href = currentQRDataURL;
            a.click();
        };

        get('btn-qr-wall-modal').onclick = () => get('modal-wall-qr').style.display = 'flex';
        get('btn-qr-new-start').onclick = () => renderGenerator();
    };

    const generateQRCore = async () => {
        const canvas = document.getElementById('qrCanvas');
        if (!canvas || typeof QRCode === 'undefined') return;

        // Normalización de URL para GitHub Pages
        const path = window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/';
        const baseUrl = `${window.location.protocol}//${window.location.host}${path}`;

        // Reducción de entropía: eliminar claves vacías
        const cleanParams = new URLSearchParams();
        Object.entries(state).forEach(([key, val]) => {
            if (val) cleanParams.append(key, val);
        });

        const scanUrl = `${baseUrl}?${cleanParams.toString()}`;

        await QRCode.toCanvas(canvas, scanUrl, {
            width: 800,
            margin: 2,
            color: { dark: '#000000', light: '#ffffff' },
            errorCorrectionLevel: 'M'
        });
        currentQRDataURL = canvas.toDataURL();
    };

    window.processQRWall = (type) => {
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

    init();
})();
