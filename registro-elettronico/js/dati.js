/* =====================================================
   DATI.JS - "livello dati" dell'applicazione
   Per ora salviamo tutto nel browser (localStorage) come STRINGHE JSON.
   In futuro, quando arriverà il database, basterà riscrivere
   SOLO le funzioni di questo file: il resto dell'app non cambia.
   ===================================================== */

// Chiavi con cui salviamo i dati nel browser
const CHIAVE_STUDENTI = "studenti";
const CHIAVE_VOTI = "voti";
const CHIAVE_SESSIONE = "utenteLoggato";

// Elenchi fissi usati nei menu a tendina
const MATERIE = ["Italiano", "Matematica", "Inglese", "Storia", "Informatica", "Sistemi e reti", "Scienze motorie"];
const TIPI_VERIFICA = ["Scritto", "Orale", "Pratico"];

// Utenti di prova, uno per ruolo (FINTI: quando avremo il back-end il login si farà sul server!)
const UTENTI_DEMO = {
    docente:  { email: "docente@scuola.it",         password: "Docente1!",  nome: "Prof. Mario Rossi", ruolo: "docente" },
    studente: { email: "giulia.bianchi@mail.it",    password: "Studente1!", nome: "Giulia Bianchi",    ruolo: "studente" },
    genitore: { email: "genitore@mail.it",          password: "Genitore1!", nome: "Anna Bianchi",      ruolo: "genitore" }
};

// Dati di esempio, scritti come STRINGA JSON e poi convertiti con JSON.parse
const DATI_DEMO = '{' +
    '"studenti":[' +
        '{"id":1,"nome":"Giulia","cognome":"Bianchi","email":"giulia.bianchi@mail.it","dataNascita":"2009-03-14"},' +
        '{"id":2,"nome":"Luca","cognome":"Verdi","email":"luca.verdi@mail.it","dataNascita":"2008-11-02"},' +
        '{"id":3,"nome":"Sara","cognome":"Neri","email":"sara.neri@mail.it","dataNascita":"2009-07-21"}' +
    '],' +
    '"voti":[' +
        '{"id":1,"idStudente":1,"materia":"Informatica","tipo":"Scritto","voto":8,"data":"2026-10-02"},' +
        '{"id":2,"idStudente":1,"materia":"Matematica","tipo":"Orale","voto":6.5,"data":"2026-10-05"},' +
        '{"id":3,"idStudente":2,"materia":"Informatica","tipo":"Scritto","voto":5,"data":"2026-10-02"},' +
        '{"id":4,"idStudente":2,"materia":"Italiano","tipo":"Orale","voto":7,"data":"2026-10-08"},' +
        '{"id":5,"idStudente":3,"materia":"Inglese","tipo":"Scritto","voto":9,"data":"2026-10-09"}' +
    ']' +
'}';

/* ---------- Funzioni generiche ---------- */

// Legge una lista dal browser: da stringa JSON a array di oggetti
function leggiLista(chiave) {
    const testo = localStorage.getItem(chiave);
    if (testo === null) {
        return [];
    }
    return JSON.parse(testo);
}

// Salva una lista nel browser: da array di oggetti a stringa JSON
function salvaLista(chiave, lista) {
    localStorage.setItem(chiave, JSON.stringify(lista));
}

// Restituisce un id nuovo (il più grande esistente + 1)
function prossimoId(lista) {
    let massimo = 0;
    for (const elemento of lista) {
        if (elemento.id > massimo) {
            massimo = elemento.id;
        }
    }
    return massimo + 1;
}

/* ---------- Studenti ---------- */

function getStudenti() {
    return leggiLista(CHIAVE_STUDENTI);
}

function getStudente(id) {
    for (const s of getStudenti()) {
        if (s.id === id) {
            return s;
        }
    }
    return null;
}

function aggiungiStudente(nome, cognome, email, dataNascita) {
    const lista = getStudenti();
    lista.push({ id: prossimoId(lista), nome: nome, cognome: cognome, email: email, dataNascita: dataNascita });
    salvaLista(CHIAVE_STUDENTI, lista);
}

// Elimina lo studente E tutti i suoi voti
function eliminaStudente(id) {
    const rimasti = [];
    for (const s of getStudenti()) {
        if (s.id !== id) rimasti.push(s);
    }
    salvaLista(CHIAVE_STUDENTI, rimasti);

    const votiRimasti = [];
    for (const v of getVoti()) {
        if (v.idStudente !== id) votiRimasti.push(v);
    }
    salvaLista(CHIAVE_VOTI, votiRimasti);
}

/* ---------- Voti ---------- */

function getVoti() {
    return leggiLista(CHIAVE_VOTI);
}

function aggiungiVoto(idStudente, materia, tipo, voto, data) {
    const lista = getVoti();
    lista.push({ id: prossimoId(lista), idStudente: idStudente, materia: materia, tipo: tipo, voto: voto, data: data });
    salvaLista(CHIAVE_VOTI, lista);
}

function eliminaVoto(id) {
    const rimasti = [];
    for (const v of getVoti()) {
        if (v.id !== id) rimasti.push(v);
    }
    salvaLista(CHIAVE_VOTI, rimasti);
}

/* ---------- Dati di esempio ---------- */

function caricaDatiDemo() {
    const dati = JSON.parse(DATI_DEMO);   // da stringa a oggetto
    salvaLista(CHIAVE_STUDENTI, dati.studenti);
    salvaLista(CHIAVE_VOTI, dati.voti);
}

function cancellaTuttiIDati() {
    localStorage.removeItem(CHIAVE_STUDENTI);
    localStorage.removeItem(CHIAVE_VOTI);
}
