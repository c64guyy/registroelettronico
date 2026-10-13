/* STUDENTI.JS - elenco e inserimento studenti */

controllaSessione();

function disegnaTabella() {
    const corpo = document.getElementById("corpoTabella");
    corpo.textContent = "";

    const studenti = getStudenti();
    document.getElementById("vuoto").hidden = studenti.length > 0;

    // Ordino per cognome (localeCompare confronta le stringhe rispettando l'alfabeto)
    studenti.sort(function (a, b) {
        return a.cognome.localeCompare(b.cognome);
    });

    const voti = getVoti();

    for (const s of studenti) {
        const riga = document.createElement("tr");
        aggiungiCella(riga, s.cognome);
        aggiungiCella(riga, s.nome);
        aggiungiCella(riga, s.email);
        aggiungiCella(riga, formattaData(s.dataNascita));

        // Media dei voti di questo studente
        const votiStudente = [];
        for (const v of voti) {
            if (v.idStudente === s.id) votiStudente.push(v);
        }
        const media = calcolaMedia(votiStudente);
        aggiungiCella(riga, media === null ? "-" : media.toFixed(2));

        // Celle con i pulsanti
        const cellaAzioni = document.createElement("td");
        const contenitore = document.createElement("div");
        contenitore.className = "azioni-cella";

        const linkVoti = document.createElement("a");
        linkVoti.textContent = "Voti";
        linkVoti.className = "btn btn-secondario piccolo";
        linkVoti.href = "voti.html?studente=" + s.id;   // passo l'id nell'URL

        const bottoneElimina = document.createElement("button");
        bottoneElimina.textContent = "Elimina";
        bottoneElimina.className = "btn btn-pericolo piccolo";
        bottoneElimina.onclick = function () {
            azioneElimina(s.id);
        };

        contenitore.appendChild(linkVoti);
        contenitore.appendChild(bottoneElimina);
        cellaAzioni.appendChild(contenitore);
        riga.appendChild(cellaAzioni);

        corpo.appendChild(riga);
    }
}

function salvaStudente() {
    // trim(): tolgo gli spazi iniziali e finali
    const nome = document.getElementById("nome").value.trim();
    const cognome = document.getElementById("cognome").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const dataNascita = document.getElementById("dataNascita").value;

    const errori = raccogliErrori([
        validaNome(nome, "nome"),
        validaNome(cognome, "cognome"),
        validaEmail(email),
        validaDataNascita(dataNascita)
    ]);

    // Controllo anche che l'email non sia già usata
    for (const s of getStudenti()) {
        if (s.email === email) {
            errori.push("Esiste già uno studente con questa email.");
            break;
        }
    }

    mostraErrori("messaggi", errori);
    if (errori.length > 0) {
        return;
    }

    aggiungiStudente(nome, cognome, email, dataNascita);

    // Svuoto il modulo
    document.getElementById("nome").value = "";
    document.getElementById("cognome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("dataNascita").value = "";

    mostraSuccesso("messaggi", "Studente " + nome + " " + cognome + " aggiunto.");
    disegnaTabella();
}

function azioneElimina(id) {
    if (confirm("Eliminare lo studente e tutti i suoi voti?")) {
        eliminaStudente(id);
        disegnaTabella();
    }
}

disegnaTabella();
