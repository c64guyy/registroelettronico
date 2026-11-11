// ===== VISTA DATI DI UNO STUDENTE (vista-studente.js) =====
// Usata sia dalla dashboard studente sia da quella del genitore.
// Richiede storage.js caricato prima.

function mostraDatiStudente(email, conGiustifica) {
    const studente = leggi("studenti").find(function (s) {
        return s.email === email;
    });
    const classe = studente ? studente.classe : "";
    const voti = leggi("voti").filter(function (v) {
        return v.emailStudente === email;
    });

    // Avviso se il docente non ha ancora inserito lo studente
    const avviso = document.getElementById("avviso");
    if (studente) {
        avviso.textContent = "Classe " + classe;
    } else {
        avviso.textContent = "Nessuno studente trovato con l'email " + email + ": il docente deve prima aggiungerlo.";
    }

    // Voti (dal più recente)
    const righeVoti = voti.slice().reverse().map(function (v) {
        return "<td>" + formattaData(v.data) + "</td><td>" + pulisci(v.materia) + "</td><td>" +
            pulisci(v.tipo) + '</td><td><span class="voto ' + classeVoto(v.voto) + '">' +
            String(v.voto).replace(".", ",") + "</span></td>";
    });
    mostraTabella("tabella-voti", righeVoti, 4, "Nessun voto inserito.");

    // Compiti della classe (dal più vicino)
    const compiti = leggi("compiti")
        .filter(function (c) { return c.classe === classe; })
        .sort(function (a, b) { return a.consegna.localeCompare(b.consegna); });
    const elencoCompiti = compiti.map(function (c) {
        return '<span class="data">Per il ' + formattaData(c.consegna) + "</span><strong>" +
            pulisci(c.materia) + "</strong> " + pulisci(c.testo);
    });
    mostraLista("lista-compiti", elencoCompiti, "Nessun compito assegnato.");

    // Assenze e ritardi (teniamo l'indice originale per poter giustificare)
    const tutteAssenze = leggi("assenze");
    const righeAssenze = [];
    let daGiustificare = 0;
    for (let i = tutteAssenze.length - 1; i >= 0; i--) {
        const a = tutteAssenze[i];
        if (a.emailStudente !== email) {
            continue;
        }
        let stato = '<span class="badge badge-ok">Giustificata</span>';
        let bottone = "";
        if (!a.giustificata) {
            daGiustificare++;
            stato = '<span class="badge badge-attesa">Da giustificare</span>';
            bottone = '<button type="button" class="btn btn-piccolo" onclick="giustifica(' + i + ')">Giustifica</button>';
        }
        let riga = "<td>" + formattaData(a.data) + "</td><td>" + pulisci(a.tipo) + "</td><td>" + stato + "</td>";
        if (conGiustifica) {
            riga += "<td>" + bottone + "</td>";
        }
        righeAssenze.push(riga);
    }
    mostraTabella("tabella-assenze", righeAssenze, conGiustifica ? 4 : 3, "Nessuna assenza o ritardo.");

    // Comunicazioni della scuola (dalla più recente)
    const comunicazioni = leggi("comunicazioni").slice().reverse().map(function (c) {
        return '<span class="data">' + formattaData(c.data) + "</span><strong>" +
            pulisci(c.titolo) + "</strong> " + pulisci(c.testo);
    });
    mostraLista("lista-comunicazioni", comunicazioni, "Nessuna comunicazione.");

    // Riepilogo in alto
    const daConsegnare = compiti.filter(function (c) { return c.consegna >= oggi(); }).length;
    scrivi("tot-media", media(voti));
    scrivi("tot-compiti", daConsegnare);
    scrivi("tot-assenze", daGiustificare);
    scrivi("tot-comunicazioni", comunicazioni.length);
}
