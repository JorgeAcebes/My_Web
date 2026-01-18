(function() {
    const UI = {
        view: document.getElementById('view-alfabetos'),
        symbols: ['◐','◑','◒','◓','◔','◕','◖','◗','◘','◙','◚','◛','◜','◝','◞','◟','◠','◡','◢','◣','◤','◥','◦','◧','◨','◩','◪','◫','◬','◭','◮','◯','☀','☁','☂','☃','☄','☉','☊','☋','☌','☍','☎','☏','☐','☑','☒','☓','☘','☙','☚','☛','☜','☞','☟','☠','☡','☢','☣','☤','☥','☦','☧','☨','☩','☪','☫','☬','☭','☮','☯','☰','☱','☲','☳','☴','☵','☶','☷','☸','☼','☽','☾','☿','♀','♁','♂','♃','♄','♅','♆','♇','♔','♕','♖','♗','♘','♙','♚','♛','♜','♝','♞','♟','♠','♡','♢','♣','♤','♥','♦','♧','♨','♩','♪','♫','♬','♭','♮','♯','♻','♼','♽','♾','⚀','⚁','⚂','⚃','⚄','⚅','⚆','⚇','⚈','⚉','⚊','⚋','⚌','⚍','⚎','⚏','⚐','⚑','⚒','⚔','⚕','⚖','⚗','⚘','⚙','⚚','⚛','⚜','⚝','⚞','⚟','⚠','⚢','⚣','⚤','⚥','⚦','⚧','⚨','⚩','⚬','⚭','⚮','⚯','⚰','⚱','⚲','⚳','⚴','⚵','⚶','⚷','⚸','⚹','⚺','⚻','⚼','⚿','⛀','⛁','⛂','⛃','⛆','⛇','⛈','⛉','⛊','⛋','⛌','⛍','⛏','⛐','⛑','⛓','⛕','⛖','⛗','⛘','⛙','⛚','⛛','⛜','⛝','⛞','⛟','⛠','⛡','⛢','⛣','⛤','⛥','⛦','⛨','⛩','⛫','⛬','⛭','⛮','⛯','⛰','⛱','⛴','⟰','⟱','⟲','⟳'],
        icons: {
            refresh: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`,
            home: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
           }
    };

    if (!UI.view) return;

    let state = { current: {} };

    const init = () => {
        UI.view.innerHTML = `
            <style>
                .abc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(65px, 1fr)); gap: 10px; margin: 1.5rem 0; }
                .abc-item { border: 1px solid #000; padding: 10px; text-align: center; }
                .abc-item span { display: block; font-size: 11px; font-weight: 700; margin-bottom: 5px; }
                .abc-item b { font-size: 1.5rem; font-weight: 400; }
                .translator-box { width: 100%; padding: 1rem; border: 1px solid #000; font-family: inherit; margin-bottom: 1rem; font-size: 0.9rem; min-height: 80px; text-transform: uppercase; }
                .result-display { background: #fafafa; border: 1px dashed #000; padding: 1.5rem; font-size: 1.8rem; margin-bottom: 1.5rem; min-height: 60px; word-break: break-all; line-height: 1.4; }
                .btn-group { display: flex; gap: 10px; width: 100%; margin-top: 10px; }
                .btn-group button { flex: 1; margin: 0; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700; letter-spacing: 1px; }
                .btn-home {background: none; border: none; cursor: pointer; display: block; margin: 2rem auto 0; padding: 10px; opacity: 0.7; }
                .btn-home:hover { opacity: 1; }
            </style>
            
            <h2 style="text-align: center; font-weight:300; letter-spacing:4px; margin-bottom:2rem; text-transform:uppercase; font-size:1rem;">Alfabetos</h2>
            <div class="app-container">
                
                <div id="abc-home">
                    <button class="btn-black" id="btn-start" style="width:100%;">GENERAR ALFABETO</button>
                </div>

                <div id="abc-editor" style="display:none;">
                    <div class="abc-grid" id="preview-grid"></div>
                    <div class="btn-group">
                        <button class="btn-black" id="btn-regenerate">${UI.icons.refresh} OTRO</button>
                        <button class="btn-black" id="btn-confirm">UTILIZAR</button>
                    </div>
                <button class="btn-outline" id="btn-cancel-edit" style="display:none;"></button>
                </div>
                <div id="abc-translator" style="display:none;">
                    <textarea class="translator-box" id="abc-input" placeholder="ESCRIBE TU MENSAJE..."></textarea>
                    <div class="result-display" id="abc-output"></div>
                    <div class="btn-group">
                        <button class="btn-black" id="btn-pdf-abc">PDF ALFABETO</button>
                        <button class="btn-black" id="btn-pdf-msg">PDF MENSAJE</button>
                    </div>
                    <button class="btn-outline" id="btn-exit-translator" style="width:100%; border:none; text-decoration:underline; margin-top:1rem;">SALIR</button>
                </div>
            </div>
            <canvas id="abc-canvas" style="display:none;" width="150" height="150"></canvas>`;

        attachEvents();
    };

    const attachEvents = () => {
        const get = (id) => document.getElementById(id);
        get('btn-start').onclick = () => { state.current = createABC(); show('editor'); renderGrid(); };
        get('btn-regenerate').onclick = () => { state.current = createABC(); renderGrid(); };
        get('btn-confirm').onclick = () => show('translator');
        get('btn-cancel-edit').onclick = () => show('home');
        get('btn-exit-translator').onclick = () => show('home');
        
        get('abc-input').oninput = (e) => {
            const input = e.target.value.toUpperCase();
            get('abc-output').textContent = input.split('').map(c => state.current[c] || c).join(' ');
        };

        get('btn-pdf-abc').onclick = () => downloadPDF('abc');
        get('btn-pdf-msg').onclick = () => downloadPDF('msg');
    };

    const createABC = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const mix = [...UI.symbols].sort(() => Math.random() - 0.5);
        return chars.reduce((acc, curr, i) => ({ ...acc, [curr]: mix[i] }), {});
    };

    const show = (scr) => {
        ['home', 'editor', 'translator'].forEach(s => 
            document.getElementById(`abc-${s}`).style.display = (s === scr) ? 'block' : 'none');
    };

    const renderGrid = () => {
        document.getElementById('preview-grid').innerHTML = Object.entries(state.current).map(([l, s]) => `
            <div class="abc-item"><span>${l}</span><b>${s}</b></div>
        `).join('');
    };

    const symbolToImage = (char) => {
        const canvas = document.getElementById('abc-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 150; canvas.height = 150;
        ctx.clearRect(0, 0, 150, 150);
        ctx.fillStyle = "#000000";
        ctx.font = "bold 110px Arial";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(char, 75, 75);
        return canvas.toDataURL("image/png");
    };

    async function downloadPDF(type) {
        if (!window.jspdf) return alert("Error: Librería jsPDF no detectada.");
        const { jsPDF } = window.jspdf;
        
        if (type === 'abc') {
            const doc = new jsPDF('l', 'mm', 'a4');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.text("ALFABETO DE SÍMBOLOS", 20, 20);
            const entries = Object.entries(state.current);
            const itemsPerRow = 7; 
            const colWidth = 38;
            const rowHeight = 35;
            entries.forEach((entry, i) => {
                const [l, s] = entry;
                const row = Math.floor(i / itemsPerRow);
                const col = i % itemsPerRow;
                const x = 20 + (col * colWidth);
                const y = 50 + (row * rowHeight);
                doc.setFontSize(14);
                doc.text(l, x + 5, y);
                doc.addImage(symbolToImage(s), 'PNG', x, y + 2, 12, 12);
            });
            doc.save("alfabeto.pdf");
        } else {
            const doc = new jsPDF('p', 'mm', 'a4');
            const msg = document.getElementById('abc-input').value.toUpperCase().trim();
            if(!msg) return alert("Escribe un mensaje.");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.text("TRADUCCIÓN:", 20, 25);
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            const splitMsg = doc.splitTextToSize(msg, 170);
            doc.text(splitMsg, 20, 35);
            let y = 35 + (splitMsg.length * 7) + 20; 
            doc.setDrawColor(200);
            doc.line(20, y - 10, 190, y - 10);
            const words = msg.split(/\s+/);
            words.forEach(word => {
                let x = 20;
                for (let char of word) {
                    if (state.current[char]) {
                        doc.addImage(symbolToImage(state.current[char]), 'PNG', x, y - 10, 14, 14);
                        x += 16;
                    } else {
                        doc.setFontSize(18);
                        doc.text(char, x, y);
                        x += 10;
                    }
                    if (x > 185) { x = 20; y += 22; }
                }
                y += 28;
                if (y > 270) { doc.addPage(); y = 30; }
            });
            doc.save("mensaje.pdf");
        }
    }

    init();
})();