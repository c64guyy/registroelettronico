/* VOTI.JS - inserimento e consultazione dei voti */

controllaSessione();

// Riempie un <select> con una lista di opzioni { valore, testo }
function riempiSelect(idSelect, opzioni) {
    const select = document.getElementById(idSelect);
    select.textContent = "";
    for (const o of opzioni) {
        const opzione = document.createElement("option");
        opzione.value = o.valore;
        opzione.textContent = o.testo;
        select.appendChild(opzione);
    }
}

function preparaMenu() {
    const studenti = getStudenti();
    studenti.sort(function (a, b) {
        return a.cognome.localeCompare(b.cognome);
    });

    const opzioniStudenti = [{ valore: "", testo: "-- scegli --" }];
    const opzioniFiltro = [{ valore: "", testo: "Tutti gli studenti" }];
    for (const s of studenti) {
        opzioniStudenti.push({ valore: String(s.id), testo: s.cognome + " " + s.nome });
        opzioniFiltro.push({ valore: String(s.id), testo: s.cognome + " " + s.nome });
    }
    riempiSelect("selStudente", opzioniStudenti);
    riempiSelect("filtroStudente", opzioniFiltro);

    const opzioniMaterie = [{ valore: "", testo: "-- scegli --" }];
    for (const m of MATERIE) {
        opzioniMaterie.push({ valore: m, testo: m });
    }
    riempiSelect("selMateria", opzioniMaterie);

    const opzioniTipi = [{ valore: "", testo: "-- scegli --" }];
    for (const t of TIPI_VERIFICA) {
        opzioniTipi.push({ valore: t, testo: t });
    }
    riempiSelect("selTipo", opzioniTipi);

    document.getElementById("dataVoto").value = oggiComeStringa();

    // Se arrivo da studenti.html?studente=3 preseleziono lo studente
    const parametri = new URLSearchParams(location.search);
    const idDaUrl = parametri.get("studente");
    if (idDaUrl !== null) {
        document.getElementById("filtroStudente").value = idDaUrl;
        document.getElementById("selStudente").value = idDaUrl;
    }
}

function disegnaTabella() {
    const corpo = document.getElementById("corpoTabella");
    corpo.textContent = "";

    const filtro = document.getElementById("filtroStudente").value;   // "" = tutti

    const mostrati = [];
    for (const v of getVoti()) {
        if (filtro === "" || String(v.idStudente) === filtro) {
            mostrati.push(v);
        }
    }

    document.getElementById("vuoto").hidden = mostrati.length > 0;

    for (const v of votiPiuRecentiPrima(mostrati)) {
        const riga = document.createElement("tr");
        aggiungiCella(riga, formattaData(v.data));
        aggiungiCella(riga, nomeStudente(v.idStudente));
        aggiungiCella(riga, v.materia);
        aggiungiCella(riga, v.tipo);
        aggiungiCellaVoto(riga, v.voto);

        const cellaAzioni = document.createElement("td");
        const bottone = document.createElement("button");
        bottone.textContent = "Elimina";
        bottone.className = "btn btn-pericolo piccolo";
        bottone.onclick = function () {
            azioneEliminaVoto(v.id);
        };
        cellaAzioni.appendChild(bottone);
        riga.appendChild(cellaAzioni);

        corpo.appendChild(riga);
    }

    // Media dei voti mostrati
    const media = calcolaMedia(mostrati);
    const spanMedia = document.getElementById("media");
    if (media === null) {
        spanMedia.textContent = "-";
        spanMedia.className = "voto";
    } else {
        spanMedia.textContent = media.toFixed(2);
        spanMedia.className = media >= 6 ? "voto sufficiente" : "voto insufficiente";
    }
}

function salvaVoto() {
    const idStudente = document.getElementById("selStudente").value;
    const materia = document.getElementById("selMateria").value;
    const tipo = document.getElementById("selTipo").value;
    const voto = document.getElementById("voto").value;
    const data = document.getElementById("dataVoto").value;

    const errori = raccogliErrori([
        validaScelta(idStudente, "Seleziona uno studente."),
        validaMateria(materia),
        validaTipoVerifica(tipo),
        validaVoto(voto),
        validaDataVoto(data)
    ]);

    mostraErrori("messaggi", errori);
    if (errori.length > 0) {
        return;
    }

    // Dai campi arrivano stringhe: converto in numeri prima di salvare
    aggiungiVoto(Number(idStudente), materia, tipo, Number(voto.replace(",", ".")), data);

    document.getElementById("voto").value = "";
    mostraSuccesso("messaggi", "Voto registrato.");
    disegnaTabella();
}

function azioneEliminaVoto(id) {
    if (confirm("Eliminare questo voto?")) {
        eliminaVoto(id);
        disegnaTabella();
    }
}

preparaMenu();
disegnaTabella();
