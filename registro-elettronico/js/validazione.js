/* =====================================================
   VALIDAZIONE.JS - controlli lato front-end
   Ogni funzione restituisce:
     ""            -> il dato è valido
     "messaggio"   -> il dato NON è valido (e dice perché)
   RICORDA: la validazione front-end è per la comodità dell'utente.
   Il back-end dovrà rifare TUTTI i controlli (sicurezza).
   ===================================================== */

// REGEX
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const REGEX_NOME = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;                      // lettere (anche accentate), apostrofo, spazio, trattino
const REGEX_PSW = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/;   // servirà per la registrazione

// Limiti
const MIN_NOME = 2;
const MAX_NOME = 30;
const MAX_EMAIL = 200;
const MIN_PASSWORD = 8;
const MAX_PASSWORD = 64;
const MIN_ETA_STUDENTE = 5;
const MAX_ETA_STUDENTE = 100;
const VOTO_MIN = 1;
const VOTO_MAX = 10;

/* ---------- Funzioni di supporto ---------- */

// Toglie dalla lista i "" (= controlli superati) e lascia solo i messaggi d'errore
function raccogliErrori(controlli) {
    const errori = [];
    for (const controllo of controlli) {
        if (controllo !== "") {
            errori.push(controllo);
        }
    }
    return errori;
}

// Calcola l'età in anni (stessa logica vista a lezione)
function calcolaEta(dataStringa) {
    const nascita = new Date(dataStringa);
    const oggi = new Date();
    let eta = oggi.getFullYear() - nascita.getFullYear();
    const mese = oggi.getMonth() - nascita.getMonth();
    const giorno = oggi.getDate() - nascita.getDate();
    if (mese < 0 || (mese === 0 && giorno < 0)) {
        eta--;
    }
    return eta;
}

// true se la data (stringa "aaaa-mm-gg") è successiva a oggi
function dataNelFuturo(dataStringa) {
    const data = new Date(dataStringa);
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    return data > oggi;
}

/* ---------- Controlli ---------- */

// etichetta serve solo per scrivere messaggi chiari ("nome", "cognome"...)
function validaNome(valore, etichetta) {
    if (valore.length < MIN_NOME || valore.length > MAX_NOME) {
        return "Il " + etichetta + " deve contenere tra " + MIN_NOME + " e " + MAX_NOME + " caratteri.";
    }
    if (!REGEX_NOME.test(valore)) {
        return "Il " + etichetta + " può contenere solo lettere, spazi, apostrofi e trattini.";
    }
    return "";
}

function validaEmail(valore) {
    if (valore.length === 0 || valore.length > MAX_EMAIL) {
        return "L'email deve essere compilata e non superare " + MAX_EMAIL + " caratteri.";
    }
    if (!REGEX_EMAIL.test(valore)) {
        return "Il formato dell'email non è valido.";
    }
    return "";
}

// Nel login controlliamo solo che ci sia: le regole sulla password si applicano alla registrazione
function validaPasswordLogin(valore) {
    if (valore.length === 0) {
        return "Inserisci la password.";
    }
    return "";
}

function validaDataNascita(valore) {
    if (valore.length !== 10) {
        return "Inserisci una data di nascita valida.";
    }
    if (dataNelFuturo(valore)) {
        return "La data di nascita non può essere nel futuro.";
    }
    const eta = calcolaEta(valore);
    if (eta < MIN_ETA_STUDENTE || eta > MAX_ETA_STUDENTE) {
        return "L'età dello studente deve essere compresa tra " + MIN_ETA_STUDENTE + " e " + MAX_ETA_STUDENTE + " anni.";
    }
    return "";
}

function validaScelta(valore, messaggio) {
    if (valore === "") {
        return messaggio;
    }
    return "";
}

function validaMateria(valore) {
    if (!MATERIE.includes(valore)) {
        return "Seleziona una materia valida.";
    }
    return "";
}

function validaTipoVerifica(valore) {
    if (!TIPI_VERIFICA.includes(valore)) {
        return "Seleziona il tipo di verifica.";
    }
    return "";
}

function validaVoto(valore) {
    if (valore === "") {
        return "Inserisci il voto.";
    }
    const numero = Number(valore.replace(",", "."));
    if (isNaN(numero) || numero < VOTO_MIN || numero > VOTO_MAX) {
        return "Il voto deve essere un numero tra " + VOTO_MIN + " e " + VOTO_MAX + ".";
    }
    return "";
}

function validaDataVoto(valore) {
    if (valore.length !== 10) {
        return "Inserisci la data della verifica.";
    }
    if (dataNelFuturo(valore)) {
        return "La data della verifica non può essere nel futuro.";
    }
    return "";
}
