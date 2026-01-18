(function() {
    const UI = {
        containerId: 'view-bingo',
        storageKey: 'bingo_phrases_data',
        icons: {
            edit: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`,
            plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
            download: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
            trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`
        }
    };

    if (!document.getElementById(UI.containerId)) return;

    let state = {
        phrases: JSON.parse(localStorage.getItem(UI.storageKey)) || [
            "Tiene 2 hermanos",
            "Su comida favorita es la pizza",
            "Le gusta el fútbol",
            "Tiene una mascota",
            "Su color favorito es el azul",
            "Ha viajado fuera de Europa",
            "Le gusta cocinar",
            "Le gusta tener plantas",
            "Su película favorita es de acción",
            "Le gusta la música pop",
            "Sabe bailar",
            "Su materia favorita es matemáticas",
            "Le gusta levantarse temprano",
            "Prefiere el verano al invierno",
            "Ha estado en un concierto",
            "Le gusta el chocolate",
            "Sabe nadar",
            "Le gusta ver series",
            "Ha conocido a algún famoso",
            "Prefiere los gatos a los perros",
            "Le gusta la playa",
            "Sabe montar en bicicleta",
            "Su día favorito es el viernes",
            "Le gusta la comida picante",
            "Le gusta dibujar",
            "Sabe patinar",
            "Su estación favorita es la primavera",
            "Le gusta madrugar",
            "Ha leído un libro este mes",
            "Prefiere dulce a salado",
            "Le gusta ir al cine",
            "Sabe jugar ajedrez",
            "Su hobby favorito es la fotografía",
            "Le gusta la montaña",
            "Ha estado en un museo este mes",
            "Su día favorito es el viernes",
            "Le gusta la comida picante",
            "Su animal favorito es el lobo",
            "Tiene una hermana menor",
            "Juega baloncesto",
            "Tiene una colección de cromos",
            "Ha construido un castillo de arena",
            "Sabe hacer figuras con globos", 
            "Sabe hacer figuras con la lengua",
            "Ha ganado una medalla en el colegio",
            "Le gusta escribir cuentos",
            "Tiene un diario secreto",
            "Ha dormido en una tienda de campaña", 
            "Sabe hacer trucos de magia", 
            "Le gusta hacer experimentos",
            "Ha plantado un árbol",
            "Le gusta buscar bichos en el jardín", 
            "Sabe saltar a la comba", 
            "Le gusta contar chistes", 
            "Hace pompas mientras se ducha", 
            "Le gusta hacer figuras con plastilina",
            "Tiene un peluche favorito", 
            "Tiene una lupa para mirar insectos",
            "Le gusta el olor de los libros nuevos",
            "Sabe hacer papiroflexia",
            "Le gusta hacer teatro",
            "Le gusta escribir canciones", 
            "Ha creado su propio superhéroe", 
            "Suele hacer galletas caseras",
            "Tiene una caja con piedras preciosas",
            "Sabe imitar voces de personajes", 
            "Le gusta pintar con los dedos", 
            "Tiene una cometa de colores", 
            "Tiene sangre A+",
            "Se hace preguntas sobre nuestra existencia",
            "Le gusta mirar las estrellas", 
            "Ha dormido en una litera",
            "Sabe lanzar una peonza", 
            "Tiene un cómic favorito", 
            "Le gusta pintar con acuarelas", 
            "Ha hecho una máscara de cartón",
            "Le gusta cuidar plantas",
            "Le gustaría vivir fuera de España",
            "Le gusta oler flores en el parque",
            "Sabe hacer sombras con las manos", 
            "Tiene un disfraz de su personaje favorito", 
            "Le gusta viajar en tren", 
            "Le gusta saltar en los charcos",
            "Tiene una caja con recuerdos", 
            "Sabe hacer un sombrero de papel",
            "Le gusta el sonido de los búhos",
            "Sabe cómo se hace una fogata",
            "Ha probado el helado de pistacho",
            "Le gusta aprender palabras en otro idioma",
            "Sabe silbar con los dedos", 
            "Le gusta decorar su habitación",
            "Ha mandado una carta por correo",
            "Sabe hacer un truco de cartas",
            "Le gusta ver documentales de animales",
            "Sabe hablar al revés",
            "Le suelen castigar mucho",
            "Ha hecho una corona de flores", 
            "Le gusta cambiar la letra cuando escribe",
            "Tiene una pelota de colores",
            "Le gusta ver vídeos de ciencia",
            "Ha probado a pintar con esponjas",
            "Tiene una caja de hilos",
            "Ha hecho un disfraz con papel",
            "Tiene una taza con su nombre", 
            "Le gusta inventar palabras nuevas",
            "Ha hecho un castillo en la nieve",
            "Tiene un gorro con orejas", 
            "Tiene una camiseta firmada por amigos",
            "Ha inventado un idioma",
            "Ha hecho un dibujo con tiza en la acera",
            "Tiene un amigo que vive en otro país", 
            "Tiene una camiseta que brilla en la oscuridad",
            "Le gusta mirar por la ventana cuando llueve",
            "Ha inventado un juego nuevo",
            "Tiene un rincón para leer", 
            "Sabe hacer un puzzle de muchas piezas", 
            "Le gusta aprender datos curiosos",
            "Le gusta mirar por el telescopio",
            "Ha dormido en una cabaña", 
            "Tiene un juego de mesa favorito",
            "Le gusta inventar recetas", 
            "Ha construido una torre con vasos",
            "Tiene un cuento favorito que ha leído muchas veces",
            "Le gusta el sonido de la lluvia en el tejado", 
            "Tiene una lista de cosas que quiere hacer", 
            "Le gusta jugar en la oscuridad",
            "Le gusta escribir poemas cortos"
        ]
    };

    const render = () => {
        const view = document.getElementById(UI.containerId);
        view.innerHTML = `
            <style>
                .bingo-app { max-width: 400px; margin: 0 auto; font-family: 'Montserrat', sans-serif; }
                .input-group { margin-bottom: 1.5rem; text-align: left; }
                .input-group label { display: block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
                .input-minimal { width: 100%; padding: 12px; border: 1px solid #000; font-family: inherit; font-size: 0.9rem; outline: none; }
                .btn-group { display: flex; gap: 10px; margin-top: 1rem; }
                .btn-group button { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; }
                .bingo-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.98); z-index: 2000; padding: 2rem; overflow-y: auto; }
                .bingo-modal.active { display: block; }
                .phrase-row { display: flex; gap: 10px; margin-bottom: 8px; }
                .phrase-row input { flex: 1; padding: 8px; border: 1px solid #eee; font-family: inherit; font-size: 0.8rem; }
            </style>

            <div class="bingo-app">
                <h2 style="font-weight:300; letter-spacing:4px; margin-bottom:2rem; text-align:center; text-transform:uppercase; font-size:1rem;">Bingo</h2>
                <div class="app-container">
                    <div class="input-group">
                        <label>Cuadrados (4-15)</label>
                        <input type="number" id="bingo-squares" class="input-minimal" value="9" min="4" max="15">
                    </div>
                    <div class="input-group">
                        <label>Nº de cartillas</label>
                        <input type="number" id="bingo-cards" class="input-minimal" value="4" min="1" max="50">
                    </div>
                    <div class="btn-group">
                        <button class="btn-outline" id="btn-bingo-edit">${UI.icons.edit} FRASES</button>
                        <button class="btn-black" id="btn-bingo-download">${UI.icons.download} PDF</button>
                    </div>
                </div>
                <button class="btn-outline" id="btn-bingo-exit" style="display:none;"></button>
            </div>

            <div id="bingo-modal-editor" class="bingo-modal">
                <div style="max-width: 500px; margin: 0 auto;">
                    <h3 style="font-weight:300; letter-spacing:2px; text-align:center; margin-bottom:2rem;">CONFIGURACIÓN</h3>
                    <div id="bingo-phrases-list"></div>
                    <button class="btn-outline" id="btn-bingo-add" style="width:100%; margin: 1rem 0;">${UI.icons.plus} AÑADIR</button>
                    <div class="btn-group" style="margin-top:3rem;">
                        <button class="btn-black" id="btn-bingo-save">GUARDAR</button>
                        <button class="btn-outline" id="btn-bingo-close">CERRAR</button>
                    </div>
                </div>
            </div>`;

        attachEvents();
    };

    const attachEvents = () => {
        const get = (id) => document.getElementById(id);
        get('btn-bingo-edit').onclick = () => { get('bingo-modal-editor').classList.add('active'); renderPhrasesList(); };
        get('btn-bingo-close').onclick = () => get('bingo-modal-editor').classList.remove('active');
        get('btn-bingo-save').onclick = () => {
            state.phrases = Array.from(document.querySelectorAll('.phrase-input-item')).map(i => i.value.trim()).filter(v => v);
            localStorage.setItem(UI.storageKey, JSON.stringify(state.phrases));
            get('bingo-modal-editor').classList.remove('active');
        };
        get('btn-bingo-add').onclick = () => document.getElementById('bingo-phrases-list').appendChild(createPhraseRow("", state.phrases.length));
        get('btn-bingo-download').onclick = generatePDF;
        get('btn-bingo-exit').onclick = () => window.showView && window.showView('home');
    };

    const createPhraseRow = (val) => {
        const div = document.createElement('div');
        div.className = 'phrase-row';
        div.innerHTML = `<input type="text" class="phrase-input-item" value="${val}"><button class="btn-outline" style="padding:5px;" onclick="this.parentElement.remove()">${UI.icons.trash}</button>`;
        return div;
    };

    const renderPhrasesList = () => {
        const container = document.getElementById('bingo-phrases-list');
        container.innerHTML = "";
        state.phrases.forEach(p => container.appendChild(createPhraseRow(p)));
    };

    async function generatePDF() {
        const { jsPDF } = window.jspdf || {};
        if (!jsPDF) return alert("jsPDF no cargado. Revisa tu index.html");

        const squares = +document.getElementById('bingo-squares').value;
        const cardsCount = +document.getElementById('bingo-cards').value;
        const perSide = Math.ceil(Math.sqrt(squares));
        
        const doc = new jsPDF('l', 'mm', 'a4');
        const cardW = 120, cardH = 80;
        const margin = 15;

        for (let i = 0; i < cardsCount; i++) {
            if (i > 0 && i % 4 === 0) doc.addPage();
            
            const pos = i % 4;
            const xOffset = margin + (pos % 2) * (cardW + 15);
            const yOffset = margin + (Math.floor(pos / 2)) * (cardH + 15);

            // Dibujar estructura
            doc.setDrawColor(0);
            doc.setLineWidth(0.5);
            doc.rect(xOffset, yOffset, cardW, cardH);
            
            doc.setFontSize(7);
            doc.text(`BINGO Nº: ${i+1}`, xOffset, yOffset - 2);

            const cellW = cardW / perSide;
            const cellH = cardH / perSide;
            const shuffled = [...state.phrases].sort(() => Math.random() - 0.5).slice(0, squares);

            doc.setLineWidth(0.1);
            for (let r = 0; r < perSide; r++) {
                for (let c = 0; c < perSide; c++) {
                    const idx = r * perSide + c;
                    if (idx >= squares) continue;

                    const cellX = xOffset + c * cellW;
                    const cellY = yOffset + r * cellH;
                    
                    doc.rect(cellX, cellY, cellW, cellH);
                    
                    const text = shuffled[idx];
                    doc.setFontSize(11);
                    const lines = doc.splitTextToSize(text, cellW - 4);
                    doc.text(lines, cellX + cellW/2, cellY + cellH/2, { align: 'center', baseline: 'middle' });
                }
            }
        }
        doc.save("bingo_cartillas.pdf");
    }

    render();
})();