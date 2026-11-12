const utente = controllaAccesso("docente");

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

function salvaStudente() {
    const nome = valore("studente-nome");
    const cognome = valore("studente-cognome");
    const classe = valore("studente-classe").toUpperCase();
    const email = valore("studente-email").toLowerCase();

    if (nome === "" || cognome === "" || classe === "" || email === "") {
        messaggio("msg-studente", T.compilaTutto, false);
        return;
    }
    if (!email.includes("@")) {
        messaggio("msg-studente", T.emailNonValida, false);
        return;
    }
    if (trovaStudente(email)) {
        messaggio("msg-studente", T.esisteGia, false);
        return;
    }

    aggiungi("studenti", { nome: nome, cognome: cognome, classe: classe, email: email });

    svuota("studente-nome");
    svuota("studente-cognome");
    svuota("studente-classe");
    svuota("studente-email");
    messaggio("msg-studente", T.studenteAggiunto, true);
    mostraTutto();
}

function salvaVoto() {
    const email = valore("voto-studente");
    const materia = valore("voto-materia");
    const voto = Number(valore("voto-numero"));

    if (email === "" || materia === "") {
        messaggio("msg-voto", T.scegliStudenteMateria, false);
        return;
    }
    // Number("") vale 0, quindi il campo vuoto va controllato a parte
    if (valore("voto-numero") === "" || voto < 1 || voto > 10) {
        messaggio("msg-voto", T.votoRange, false);
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
    messaggio("msg-voto", T.votoSalvato, true);
    mostraTutto();
}

function salvaAssenza() {
    const email = valore("assenza-studente");
    if (email === "") {
        messaggio("msg-assenza", T.scegliStudente, false);
        return;
    }

    aggiungi("assenze", {
        emailStudente: email,
        tipo: valore("assenza-tipo"),
        data: valore("assenza-data") || oggi(),
        giustificata: false
    });

    messaggio("msg-assenza", T.salvato, true);
    mostraTutto();
}

function salvaCompito() {
    const classe = valore("compito-classe").toUpperCase();
    const materia = valore("compito-materia");
    const testo = valore("compito-testo");
    const consegna = valore("compito-consegna");

    if (classe === "" || materia === "" || testo === "" || consegna === "") {
        messaggio("msg-compito", T.compilaTutto, false);
        return;
    }

    aggiungi("compiti", { classe: classe, materia: materia, testo: testo, consegna: consegna });

    svuota("compito-testo");
    messaggio("msg-compito", T.compitoAssegnato, true);
    mostraTutto();
}

function salvaComunicazione() {
    const titolo = valore("com-titolo");
    const testo = valore("com-testo");

    if (titolo === "" || testo === "") {
        messaggio("msg-com", T.titoloTesto, false);
        return;
    }

    aggiungi("comunicazioni", { titolo: titolo, testo: testo, data: oggi() });

    svuota("com-titolo");
    svuota("com-testo");
    messaggio("msg-com", T.comPubblicata, true);
    mostraTutto();
}

function cancellaDati() {
    if (!confirm(T.confermaCancella)) {
        return;
    }
    localStorage.removeItem("studenti");
    localStorage.removeItem("voti");
    localStorage.removeItem("assenze");
    localStorage.removeItem("compiti");
    localStorage.removeItem("comunicazioni");
    mostraTutto();
}

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
    select.innerHTML = '<option value="">' + T.sceltaStudente + "</option>";
    leggi("studenti").forEach(function (s) {
        select.innerHTML += '<option value="' + pulisci(s.email) + '">' +
            pulisci(s.cognome + " " + s.nome) + " (" + pulisci(s.classe) + ")</option>";
    });
    select.value = scelto;
}

// Ridisegna tutta la pagina: va richiamata dopo ogni modifica ai dati
function mostraTutto() {
    const studenti = leggi("studenti");
    const classi = elencoClassi();

    scrivi("tot-classi", classi.length);
    scrivi("tot-studenti", studenti.length);
    scrivi("tot-voti", leggi("voti").length);
    scrivi("tot-compiti", leggi("compiti").length);

    const righeClassi = classi.map(function (classe) {
        const quanti = studenti.filter(function (s) { return s.classe === classe; }).length;
        return "<td>" + pulisci(classe) + "</td><td>" + quanti + "</td><td>" + media(votiDellaClasse(classe)) + "</td>";
    });
    mostraTabella("tabella-classi", righeClassi, 3, T.vuotoClassi);

    const righeStudenti = studenti.map(function (s) {
        return "<td>" + pulisci(s.cognome + " " + s.nome) + "</td><td>" + pulisci(s.classe) + "</td><td>" + pulisci(s.email) + "</td>";
    });
    mostraTabella("tabella-studenti", righeStudenti, 3, T.vuotoStudenti);

    const righeVoti = leggi("voti").slice().reverse().map(function (v) {
        return "<td>" + formattaData(v.data) + "</td><td>" + nomeStudente(v.emailStudente) + "</td><td>" +
            pulisci(v.materia) + "</td><td>" + pulisci(tipo(v.tipo)) + '</td><td><span class="voto ' +
            classeVoto(v.voto) + '">' + numero(v.voto) + "</span></td>";
    });
    mostraTabella("tabella-voti", righeVoti, 5, T.vuotoVoti);

    const righeAssenze = leggi("assenze").slice().reverse().map(function (a) {
        const stato = a.giustificata
            ? '<span class="badge badge-ok">' + T.giustificata + "</span>"
            : '<span class="badge badge-attesa">' + T.daGiustificare + "</span>";
        return "<td>" + formattaData(a.data) + "</td><td>" + nomeStudente(a.emailStudente) + "</td><td>" +
            pulisci(tipo(a.tipo)) + "</td><td>" + stato + "</td>";
    });
    mostraTabella("tabella-assenze", righeAssenze, 4, T.vuotoAssenze);

    const compiti = leggi("compiti").slice().reverse().map(function (c) {
        return '<span class="data">' + pulisci(c.classe) + " - " + T.consegna + " " + formattaData(c.consegna) + "</span><strong>" +
            pulisci(c.materia) + "</strong> " + pulisci(c.testo);
    });
    mostraLista("lista-compiti", compiti, T.vuotoCompiti);

    const comunicazioni = leggi("comunicazioni").slice().reverse().map(function (c) {
        return '<span class="data">' + formattaData(c.data) + "</span><strong>" +
            pulisci(c.titolo) + "</strong> " + pulisci(c.testo);
    });
    mostraLista("lista-comunicazioni", comunicazioni, T.vuotoComunicazioni);

    riempiSelect("voto-studente");
    riempiSelect("assenza-studente");
}

if (utente !== null) {
    document.getElementById("voto-data").value = oggi();
    document.getElementById("assenza-data").value = oggi();
    mostraTutto();
}
