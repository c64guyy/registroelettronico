/* =====================================================
   COMMON.JS - funzioni usate da più pagine
   ===================================================== */

/* ---------- Sessione (BOM: sessionStorage e location) ---------- */

// Restituisce l'utente loggato (oggetto) oppure null
function getUtente() {
    const testo = sessionStorage.getItem(CHIAVE_SESSIONE);
    if (testo === null) {
        return null;
    }
    return JSON.parse(testo);
}

// Da chiamare all'inizio di ogni pagina protetta
function controllaSessione() {
    const utente = getUtente();
    if (utente === null) {
        location.replace("index.html");   // replace: non lascia la pagina nella cronologia
        return null;
    }
    const spanNome = document.getElementById("nomeUtente");
    if (spanNome !== null) {
        spanNome.textContent = utente.nome;
    }
    return utente;
}

function logout() {
    sessionStorage.removeItem(CHIAVE_SESSIONE);
    location.href = "index.html";
}

/* ---------- Messaggi a video (al posto degli alert) ---------- */

// Mostra una lista di errori dentro il box con l'id indicato (lista vuota = nasconde il box)
// Usiamo textContent e NON innerHTML: così un utente non può "iniettare" codice HTML/JS.
function mostraErrori(idBox, errori) {
    const box = document.getElementById(idBox);
    box.textContent = "";
    if (errori.length === 0) {
        box.className = "messaggi";
        return;
    }
    box.className = "messaggi errore";
    const lista = document.createElement("ul");
    for (const errore of errori) {
        const voce = document.createElement("li");
        voce.textContent = errore;
        lista.appendChild(voce);
    }
    box.appendChild(lista);
}

function mostraSuccesso(idBox, testo) {
    const box = document.getElementById(idBox);
    box.className = "messaggi successo";
    box.textContent = testo;
}

/* ---------- Utilità ---------- */

// Media di una lista di voti (oggetti con proprietà "voto"); null se la lista è vuota
function calcolaMedia(listaVoti) {
    if (listaVoti.length === 0) {
        return null;
    }
    let somma = 0;
    for (const v of listaVoti) {
        somma += v.voto;
    }
    return somma / listaVoti.length;
}

// "2026-10-09" -> "09/10/2026"
function formattaData(dataStringa) {
    const parti = dataStringa.split("-");
    return parti[2] + "/" + parti[1] + "/" + parti[0];
}

// Crea una cella <td> con del testo e la aggiunge alla riga
function aggiungiCella(riga, testo) {
    const cella = document.createElement("td");
    cella.textContent = testo;
    riga.appendChild(cella);
    return cella;
}

// Crea una cella con il voto colorato (verde >= 6, rosso < 6)
function aggiungiCellaVoto(riga, voto) {
    const cella = document.createElement("td");
    const span = document.createElement("span");
    span.textContent = voto;
    span.className = voto >= 6 ? "voto sufficiente" : "voto insufficiente";
    cella.appendChild(span);
    riga.appendChild(cella);
}

// Data di oggi nel formato "aaaa-mm-gg" (utile come valore di default)
function oggiComeStringa() {
    return new Date().toISOString().slice(0, 10);
}

// "Cognome Nome" a partire dall'id dello studente
function nomeStudente(id) {
    const s = getStudente(id);
    if (s === null) {
        return "(eliminato)";
    }
    return s.cognome + " " + s.nome;
}

// Restituisce una COPIA dei voti ordinati dal più recente al più vecchio
function votiPiuRecentiPrima(listaVoti) {
    const copia = listaVoti.slice();
    copia.sort(function (a, b) {
        if (a.data < b.data) return 1;
        if (a.data > b.data) return -1;
        return b.id - a.id;
    });
    return copia;
}
