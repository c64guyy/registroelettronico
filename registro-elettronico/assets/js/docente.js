// ===== DASHBOARD DOCENTE (docente.js) =====
// Richiede storage.js caricato prima.

const utente = controllaAccesso("docente");

// ----- Funzioni di aiuto -----
function valore(id) {
    return document.getElementById(id).value.trim();
}

function svuota(id) {
    document.getElementById(id).value = "";
}

function messaggio(id, testo, ok) {
    const box = document.getElementById(id);
    box.textContent = testo;
    box.style.color = ok ? "green" : "red";
}

function trovaStudente(email) {
    return leggi("studenti").find(function (s) {
        return s.email === email;
    });
}

function nomeStudente(email) {
    const s = trovaStudente(email);
    if (s) {
        return pulisci(s.cognome + " " + s.nome);
    }
    return pulisci(email);
}

// ----- Inserimento dati (ogni funzione salva un elemento in un foglio JSON) -----
function salvaStudente() {
    const nome = valore("studente-nome");
    const cognome = valore("studente-cognome");
    const classe = valore("studente-classe").toUpperCase();
    const email = valore("studente-email").toLowerCase();

    if (nome === "" || cognome === "" || classe === "" || email === "") {
        messaggio("msg-studente", "Compila tutti i campi.", false);
        return;
    }
    if (!email.includes("@")) {
        messaggio("msg-studente", "Email non valida.", false);
        return;
    }
    if (trovaStudente(email)) {
        messaggio("msg-studente", "Esiste già uno studente con questa email.", false);
        return;
    }

    aggiungi("studenti", { nome: nome, cognome: cognome, classe: classe, email: email });

    svuota("studente-nome");
    svuota("studente-cognome");
    svuota("studente-classe");
    svuota("studente-email");
    messaggio("msg-studente", "Studente aggiunto!", true);
    mostraTutto();
}

function salvaVoto() {
    const email = valore("voto-studente");
    const materia = valore("voto-materia");
    const voto = Number(valore("voto-numero"));

    if (email === "" || materia === "") {
        messaggio("msg-voto", "Scegli lo studente e scrivi la materia.", false);
        return;
    }
    if (valore("voto-numero") === "" || voto < 1 || voto > 10) {
        messaggio("msg-voto", "Il voto deve essere tra 1 e 10.", false);
        return;
    }

    aggiungi("voti", {
        emailStudente: email,
        materia: materia,
        tipo: valore("voto-tipo"),
        voto: voto,
        data: valore("voto-data") || oggi()
    });

    svuota("voto-numero");
    messaggio("msg-voto", "Voto salvato!", true);
    mostraTutto();
}

function salvaAssenza() {
    const email = valore("assenza-studente");
    if (email === "") {
        messaggio("msg-assenza", "Scegli uno studente.", false);
        return;
    }

    aggiungi("assenze", {
        emailStudente: email,
        tipo: valore("assenza-tipo"),
        data: valore("assenza-data") || oggi(),
        giustificata: false
    });

    messaggio("msg-assenza", "Salvato!", true);
    mostraTutto();
}

function salvaCompito() {
    const classe = valore("compito-classe").toUpperCase();
    const materia = valore("compito-materia");
    const testo = valore("compito-testo");
    const consegna = valore("compito-consegna");

    if (classe === "" || materia === "" || testo === "" || consegna === "") {
        messaggio("msg-compito", "Compila tutti i campi.", false);
        return;
    }

    aggiungi("compiti", { classe: classe, materia: materia, testo: testo, consegna: consegna });

    svuota("compito-testo");
    messaggio("msg-compito", "Compito assegnato!", true);
    mostraTutto();
}

function salvaComunicazione() {
    const titolo = valore("com-titolo");
    const testo = valore("com-testo");

    if (titolo === "" || testo === "") {
        messaggio("msg-com", "Scrivi titolo e testo.", false);
        return;
    }

    aggiungi("comunicazioni", { titolo: titolo, testo: testo, data: oggi() });

    svuota("com-titolo");
    svuota("com-testo");
    messaggio("msg-com", "Comunicazione pubblicata!", true);
    mostraTutto();
}

function cancellaDati() {
    if (!confirm("Vuoi davvero cancellare tutti i dati?")) {
        return;
    }
    localStorage.removeItem("studenti");
    localStorage.removeItem("voti");
    localStorage.removeItem("assenze");
    localStorage.removeItem("compiti");
    localStorage.removeItem("comunicazioni");
    mostraTutto();
}

// ----- Disegno della pagina (si rilegge tutto dal localStorage) -----
function elencoClassi() {
    const classi = [];
    leggi("studenti").forEach(function (s) {
        if (!classi.includes(s.classe)) {
            classi.push(s.classe);
        }
    });
    return classi.sort();
}

function votiDellaClasse(classe) {
    const emails = leggi("studenti")
        .filter(function (s) { return s.classe === classe; })
        .map(function (s) { return s.email; });
    return leggi("voti").filter(function (v) {
        return emails.includes(v.emailStudente);
    });
}

function riempiSelect(id) {
    const select = document.getElementById(id);
    const scelto = select.value;
    select.innerHTML = '<option value="">-- scegli uno studente --</option>';
    leggi("studenti").forEach(function (s) {
        select.innerHTML += '<option value="' + pulisci(s.email) + '">' +
            pulisci(s.cognome + " " + s.nome) + " (" + pulisci(s.classe) + ")</option>";
    });
    select.value = scelto;
}

function mostraTutto() {
    const studenti = leggi("studenti");
    const classi = elencoClassi();

    // Riepilogo in alto
    scrivi("tot-classi", classi.length);
    scrivi("tot-studenti", studenti.length);
    scrivi("tot-voti", leggi("voti").length);
    scrivi("tot-compiti", leggi("compiti").length);

    // Tabella classi
    const righeClassi = classi.map(function (classe) {
        const quanti = studenti.filter(function (s) { return s.classe === classe; }).length;
        return "<td>" + pulisci(classe) + "</td><td>" + quanti + "</td><td>" + media(votiDellaClasse(classe)) + "</td>";
    });
    mostraTabella("tabella-classi", righeClassi, 3, "Nessuna classe: aggiungi uno studente.");

    // Tabella studenti
    const righeStudenti = studenti.map(function (s) {
        return "<td>" + pulisci(s.cognome + " " + s.nome) + "</td><td>" + pulisci(s.classe) + "</td><td>" + pulisci(s.email) + "</td>";
    });
    mostraTabella("tabella-studenti", righeStudenti, 3, "Nessuno studente inserito.");

    // Tabella voti (dal più recente)
    const righeVoti = leggi("voti").slice().reverse().map(function (v) {
        return "<td>" + formattaData(v.data) + "</td><td>" + nomeStudente(v.emailStudente) + "</td><td>" +
            pulisci(v.materia) + "</td><td>" + pulisci(v.tipo) + '</td><td><span class="voto ' +
            classeVoto(v.voto) + '">' + String(v.voto).replace(".", ",") + "</span></td>";
    });
    mostraTabella("tabella-voti", righeVoti, 5, "Nessun voto inserito.");

    // Tabella assenze
    const righeAssenze = leggi("assenze").slice().reverse().map(function (a) {
        const stato = a.giustificata
            ? '<span class="badge badge-ok">Giustificata</span>'
            : '<span class="badge badge-attesa">Da giustificare</span>';
        return "<td>" + formattaData(a.data) + "</td><td>" + nomeStudente(a.emailStudente) + "</td><td>" +
            pulisci(a.tipo) + "</td><td>" + stato + "</td>";
    });
    mostraTabella("tabella-assenze", righeAssenze, 4, "Nessuna assenza registrata.");

    // Liste compiti e comunicazioni
    const compiti = leggi("compiti").slice().reverse().map(function (c) {
        return '<span class="data">' + pulisci(c.classe) + " - consegna " + formattaData(c.consegna) + "</span><strong>" +
            pulisci(c.materia) + "</strong> " + pulisci(c.testo);
    });
    mostraLista("lista-compiti", compiti, "Nessun compito assegnato.");

    const comunicazioni = leggi("comunicazioni").slice().reverse().map(function (c) {
        return '<span class="data">' + formattaData(c.data) + "</span><strong>" +
            pulisci(c.titolo) + "</strong> " + pulisci(c.testo);
    });
    mostraLista("lista-comunicazioni", comunicazioni, "Nessuna comunicazione pubblicata.");

    // Menu a tendina
    riempiSelect("voto-studente");
    riempiSelect("assenza-studente");
}

// ----- Avvio -----
if (utente !== null) {
    scrivi("nome-utente", utente.nome);
    scrivi("nome-benvenuto", utente.nome.split(" ")[1]);
    document.getElementById("voto-data").value = oggi();
    document.getElementById("assenza-data").value = oggi();
    mostraTutto();
}
