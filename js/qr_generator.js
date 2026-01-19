<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generador QR - Contacto Directo</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Montserrat', sans-serif; background: #f5f5f5; padding: 20px; }
        .qr-app { max-width: 450px; margin: 0 auto; text-align: center; }
        .app-container { border: 2px solid #000; padding: 2rem; background: #fff; }
        h2 { font-weight: 300; letter-spacing: 4px; margin-bottom: 2rem; text-transform: uppercase; font-size: 1rem; }
        .input-group { margin-bottom: 1.2rem; text-align: left; }
        .input-group label { display: block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
        .input-minimal { width: 100%; padding: 12px; border: 1px solid #000; font-family: inherit; font-size: 0.9rem; }
        .btn-black { background: #000; color: #fff; border: none; padding: 15px; cursor: pointer; font-weight: 700; letter-spacing: 1px; width: 100%; transition: opacity 0.3s; }
        .btn-black:hover { opacity: 0.8; }
        .btn-outline { background: #fff; color: #000; border: 1px solid #000; padding: 15px; cursor: pointer; font-weight: 700; flex: 1; transition: background 0.3s; }
        .btn-outline:hover { background: #f0f0f0; }
        .btn-group { display: flex; gap: 10px; margin-top: 10px; }
        .qr-result-area { display: none; margin-top: 2rem; border-top: 1px dashed #000; padding-top: 2rem; }
        #qrcode { display: flex; justify-content: center; margin-bottom: 1.5rem; }
        #qrcode canvas, #qrcode img { border: 1px solid #eee !important; }
        .info-box { background: #f9f9f9; border-left: 3px solid #000; padding: 15px; margin-top: 1rem; text-align: left; font-size: 0.85rem; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.98); z-index: 3000; align-items: center; justify-content: center; }
        .modal-content { max-width: 350px; width: 90%; text-align: center; }
        .reset-btn { background: none; border: none; text-decoration: underline; font-size: 0.7rem; opacity: 0.5; cursor: pointer; margin-top: 2rem; }
    </style>
</head>
<body>
    <div class="qr-app">
        <h2>Generador QR - Contacto Directo</h2>
        <div class="app-container">
            <div id="formSection">
                <div class="input-group">
                    <label>Nombre Completo *</label>
                    <input type="text" id="fullName" class="input-minimal" placeholder="Juan Pérez García">
                </div>
                <div class="input-group">
                    <label>Organización / Empresa</label>
                    <input type="text" id="org" class="input-minimal" placeholder="Mi Empresa S.L.">
                </div>
                <div class="input-group">
                    <label>Correo Electrónico</label>
                    <input type="email" id="email" class="input-minimal" placeholder="contacto@ejemplo.com">
                </div>
                <div class="input-group">
                    <label>Teléfono</label>
                    <input type="tel" id="phone" class="input-minimal" placeholder="+34 600 123 456">
                </div>
                <div class="input-group">
                    <label>Sitio Web</label>
                    <input type="url" id="website" class="input-minimal" placeholder="https://miwebsite.com">
                </div>
                <div class="input-group">
                    <label>Dirección</label>
                    <input type="text" id="address" class="input-minimal" placeholder="Calle Principal 123, Madrid">
                </div>
                <div class="input-group">
                    <label>Notas adicionales</label>
                    <textarea id="notes" class="input-minimal" style="height:60px" placeholder="Información adicional..."></textarea>
                </div>
                <button class="btn-black" id="generateBtn">GENERAR QR</button>
            </div>

            <div id="resultSection" class="qr-result-area">
                <div id="qrcode"></div>
                <div class="btn-group">
                    <button class="btn-black" id="downloadBtn">DESCARGAR PNG</button>
                    <button class="btn-outline" id="wallpaperBtn">FONDO PANTALLA</button>
                </div>
            </div>
        </div>
        
        <button id="resetBtn" class="reset-btn">REINICIAR</button>
    </div>

    <div id="wallpaperModal" class="modal">
        <div class="modal-content">
            <h3 style="font-weight:300; letter-spacing:2px; margin-bottom:2rem;">TIPO DE DISPOSITIVO</h3>
            <button class="btn-black" id="mobileWall" style="margin-bottom:10px;">MÓVIL (9:16)</button>
            <button class="btn-black" id="tabletWall" style="margin-bottom:10px;">TABLET (iPad Pro)</button>
            <button class="btn-outline" id="closeModal" style="width:100%; margin-top:20px;">CANCELAR</button>
        </div>
    </div>

    <script>
        const storageKey = 'qr_vcard_data_v1';
        let currentQR = null;
        let currentVCard = '';

        // Cargar datos guardados
        const savedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
        if (savedData.fullName) document.getElementById('fullName').value = savedData.fullName;
        if (savedData.org) document.getElementById('org').value = savedData.org;
        if (savedData.email) document.getElementById('email').value = savedData.email;
        if (savedData.phone) document.getElementById('phone').value = savedData.phone;
        if (savedData.website) document.getElementById('website').value = savedData.website;
        if (savedData.address) document.getElementById('address').value = savedData.address;
        if (savedData.notes) document.getElementById('notes').value = savedData.notes;

        // Generar vCard
        function generateVCard() {
            const fullName = document.getElementById('fullName').value.trim();
            const org = document.getElementById('org').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const website = document.getElementById('website').value.trim();
            const address = document.getElementById('address').value.trim();
            const notes = document.getElementById('notes').value.trim();

            if (!fullName) {
                alert('Por favor, introduce al menos tu nombre completo');
                return null;
            }

            // Dividir nombre en partes (apellidos;nombre)
            const nameParts = fullName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            let vcard = 'BEGIN:VCARD\n';
            vcard += 'VERSION:3.0\n';
            vcard += `FN:${fullName}\n`;
            vcard += `N:${lastName};${firstName};;;\n`;
            if (org) vcard += `ORG:${org}\n`;
            if (email) vcard += `EMAIL;TYPE=INTERNET:${email}\n`;
            if (phone) vcard += `TEL;TYPE=CELL:${phone}\n`;
            if (website) vcard += `URL:${website}\n`;
            if (address) vcard += `ADR;TYPE=WORK:;;${address};;;;\n`;
            if (notes) vcard += `NOTE:${notes}\n`;
            vcard += 'END:VCARD';

            return vcard;
        }

        // Generar QR
        document.getElementById('generateBtn').addEventListener('click', function() {
            const vcard = generateVCard();
            if (!vcard) return;

            currentVCard = vcard;

            // Guardar datos
            const data = {
                fullName: document.getElementById('fullName').value,
                org: document.getElementById('org').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                website: document.getElementById('website').value,
                address: document.getElementById('address').value,
                notes: document.getElementById('notes').value
            };
            localStorage.setItem(storageKey, JSON.stringify(data));

            // Limpiar QR anterior
            document.getElementById('qrcode').innerHTML = '';

            // Generar nuevo QR
            currentQR = new QRCode(document.getElementById('qrcode'), {
                text: vcard,
                width: 300,
                height: 300,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });

            document.getElementById('resultSection').style.display = 'block';
            document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
        });

        // Descargar PNG
        document.getElementById('downloadBtn').addEventListener('click', function() {
            const canvas = document.querySelector('#qrcode canvas');
            if (canvas) {
                const link = document.createElement('a');
                link.download = `QR_Contacto_${document.getElementById('fullName').value.replace(/\s/g, '_')}.png`;
                link.href = canvas.toDataURL();
                link.click();
            }
        });

        // Wallpaper modal
        document.getElementById('wallpaperBtn').addEventListener('click', function() {
            document.getElementById('wallpaperModal').style.display = 'flex';
        });

        document.getElementById('closeModal').addEventListener('click', function() {
            document.getElementById('wallpaperModal').style.display = 'none';
        });

        // Generar fondos de pantalla
        function generateWallpaper(type) {
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

            const link = document.createElement('a');
            link.download = `Wallpaper_QR_${type.toUpperCase()}.png`;
            link.href = wallCanvas.toDataURL();
            link.click();

            document.getElementById('wallpaperModal').style.display = 'none';
        }

        document.getElementById('mobileWall').addEventListener('click', () => generateWallpaper('mobile'));
        document.getElementById('tabletWall').addEventListener('click', () => generateWallpaper('tablet'));

        // Reset
        document.getElementById('resetBtn').addEventListener('click', function() {
            if (confirm('¿Seguro que quieres borrar todos los datos?')) {
                localStorage.removeItem(storageKey);
                location.reload();
            }
        });
    </script>
</body>
</html>
