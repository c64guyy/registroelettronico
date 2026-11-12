
function mostraDatiStudente(email, conGiustifica) {
    const studente = leggi("studenti").find(function (s) {
        return s.email === email;
    });
    const classe = studente ? studente.classe : "";
    const voti = leggi("voti").filter(function (v) {
        return v.emailStudente === email;
    });

    const avviso = document.getElementById("avviso");
    if (studente) {
        avviso.textContent = T.classe + " " + classe;
    } else {
        avviso.textContent = T.nessunStudente.replace("{email}", email);
    }

    const righeVoti = voti.slice().reverse().map(function (v) {
        return "<td>" + formattaData(v.data) + "</td><td>" + pulisci(v.materia) + "</td><td>" +
            pulisci(tipo(v.tipo)) + '</td><td><span class="voto ' + classeVoto(v.voto) + '">' +
            numero(v.voto) + "</span></td>";
    });
    mostraTabella("tabella-voti", righeVoti, 4, T.vuotoVoti);

    const compiti = leggi("compiti")
        .filter(function (c) { return c.classe === classe; })
        .sort(function (a, b) { return a.consegna.localeCompare(b.consegna); });
    const elencoCompiti = compiti.map(function (c) {
        return '<span class="data">' + T.perIl + " " + formattaData(c.consegna) + "</span><strong>" +
            pulisci(c.materia) + "</strong> " + pulisci(c.testo);
    });
    mostraLista("lista-compiti", elencoCompiti, T.vuotoCompiti);

    // Si scorre dalla fine ma "i" resta la posizione vera: serve a giustifica(i)
    const tutteAssenze = leggi("assenze");
    const righeAssenze = [];
    let daGiustificare = 0;
    for (let i = tutteAssenze.length - 1; i >= 0; i--) {
        const a = tutteAssenze[i];
        if (a.emailStudente !== email) {
            continue;
        }
        let stato = '<span class="badge badge-ok">' + T.giustificata + "</span>";
        let bottone = "";
        if (!a.giustificata) {
            daGiustificare++;
            stato = '<span class="badge badge-attesa">' + T.daGiustificare + "</span>";
            bottone = '<button type="button" class="btn btn-piccolo" onclick="giustifica(' + i + ')">' + T.giustifica + "</button>";
        }
        let riga = "<td>" + formattaData(a.data) + "</td><td>" + pulisci(tipo(a.tipo)) + "</td><td>" + stato + "</td>";
        if (conGiustifica) {
            riga += "<td>" + bottone + "</td>";
        }
        righeAssenze.push(riga);
    }
    mostraTabella("tabella-assenze", righeAssenze, conGiustifica ? 4 : 3, T.vuotoAssenze);

    const comunicazioni = leggi("comunicazioni").slice().reverse().map(function (c) {
        return '<span class="data">' + formattaData(c.data) + "</span><strong>" +
            pulisci(c.titolo) + "</strong> " + pulisci(c.testo);
    });
    mostraLista("lista-comunicazioni", comunicazioni, T.vuotoComunicazioni);

    const daConsegnare = compiti.filter(function (c) { return c.consegna >= oggi(); }).length;
    scrivi("tot-media", media(voti));
    scrivi("tot-compiti", daConsegnare);
    scrivi("tot-assenze", daGiustificare);
    scrivi("tot-comunicazioni", comunicazioni.length);
}
