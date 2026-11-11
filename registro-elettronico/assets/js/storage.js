// ===== FUNZIONI CONDIVISE (storage.js) =====
// Ogni "foglio JSON" è un array salvato nel localStorage con una chiave:
//   "studenti", "voti", "compiti", "comunicazioni", "assenze"

// Legge un foglio JSON: se non esiste ancora restituisce un array vuoto
function leggi(chiave) {
    const testo = localStorage.getItem(chiave);
    return JSON.parse(testo) || [];
}

// Salva un foglio JSON (stringify = da oggetto a stringa)
function salva(chiave, dati) {
    try {
        localStorage.setItem(chiave, JSON.stringify(dati));
    } catch (errore) {
        alert("Impossibile salvare: spazio del browser esaurito.");
    }
}

// Aggiunge un elemento in fondo a un foglio JSON
function aggiungi(chiave, elemento) {
    const dati = leggi(chiave);
    dati.push(elemento);
    salva(chiave, dati);
}

// ----- Sessione -----
// Se "Ricordami" è spuntato la sessione va nel localStorage (resta),
// altrimenti nel sessionStorage (sparisce chiudendo la scheda).
function utenteCorrente() {
    const testo = sessionStorage.getItem("sessione") || localStorage.getItem("sessione");
    return JSON.parse(testo);
}

// Da chiamare all'inizio di ogni dashboard: se non sei loggato (o hai il
// ruolo sbagliato) ti rimanda al login
function controllaAccesso(ruoloAtteso) {
    const utente = utenteCorrente();
    if (utente === null || utente.ruolo !== ruoloAtteso) {
        window.location.href = "index.html";
        return null;
    }
    return utente;
}

function esci() {
    sessionStorage.removeItem("sessione");
    localStorage.removeItem("sessione");
    window.location.href = "index.html";
}

// ----- Utilità -----
// Calcola la media di un array di voti (restituisce "-" se non ci sono voti)
function media(voti) {
    if (voti.length === 0) {
        return "-";
    }
    let somma = 0;
    for (let i = 0; i < voti.length; i++) {
        somma += voti[i].voto;
    }
    return (somma / voti.length).toFixed(1).replace(".", ",");
}

// Restituisce la classe CSS giusta per colorare un voto
function classeVoto(voto) {
    if (voto >= 7) return "voto-alto";
    if (voto >= 6) return "voto-medio";
    return "voto-basso";
}

// Da "2026-11-11" a "11/11/2026"
function formattaData(data) {
    const parti = data.split("-");
    return parti[2] + "/" + parti[1] + "/" + parti[0];
}

// Data di oggi nel formato "2026-11-11" (quello dei campi <input type="date">)
function oggi() {
    return new Date().toISOString().slice(0, 10);
}

// Evita che un testo scritto dall'utente venga interpretato come HTML
function pulisci(testo) {
    const div = document.createElement("div");
    div.textContent = testo;
    return div.innerHTML;
}

// ----- Funzioni di disegno (usate da tutte le dashboard) -----
function mostraTabella(idCorpo, righe, colonne, testoVuoto) {
    // righe = array di stringhe HTML già pronte per le <td>
    const corpo = document.getElementById(idCorpo);
    if (righe.length === 0) {
        corpo.innerHTML = '<tr><td colspan="' + colonne + '">' + testoVuoto + '</td></tr>';
        return;
    }
    corpo.innerHTML = "";
    for (let i = 0; i < righe.length; i++) {
        corpo.innerHTML += "<tr>" + righe[i] + "</tr>";
    }
}

function mostraLista(idLista, elementi, testoVuoto) {
    // elementi = array di stringhe HTML già pronte per i <li>
    const lista = document.getElementById(idLista);
    if (elementi.length === 0) {
        lista.innerHTML = "<li>" + testoVuoto + "</li>";
        return;
    }
    lista.innerHTML = "";
    for (let i = 0; i < elementi.length; i++) {
        lista.innerHTML += "<li>" + elementi[i] + "</li>";
    }
}

function scrivi(id, valore) {
    document.getElementById(id).textContent = valore;
}
