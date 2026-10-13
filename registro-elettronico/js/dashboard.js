/* DASHBOARD.JS - riepilogo della classe */

controllaSessione();

function aggiornaDashboard() {
    const studenti = getStudenti();
    const voti = getVoti();

    // Statistiche
    document.getElementById("numStudenti").textContent = studenti.length;
    document.getElementById("numVoti").textContent = voti.length;

    const media = calcolaMedia(voti);
    document.getElementById("mediaGenerale").textContent = media === null ? "-" : media.toFixed(2);

    let insufficienze = 0;
    for (const v of voti) {
        if (v.voto < 6) insufficienze++;
    }
    document.getElementById("numInsufficienze").textContent = insufficienze;

    // Ultimi 5 voti
    const corpo = document.getElementById("corpoTabella");
    corpo.textContent = "";
    document.getElementById("vuoto").hidden = voti.length > 0;

    const ultimi = votiPiuRecentiPrima(voti).slice(0, 5);
    for (const v of ultimi) {
        const riga = document.createElement("tr");
        aggiungiCella(riga, formattaData(v.data));
        aggiungiCella(riga, nomeStudente(v.idStudente));
        aggiungiCella(riga, v.materia);
        aggiungiCellaVoto(riga, v.voto);
        corpo.appendChild(riga);
    }
}

function azioneCaricaDemo() {
    if (getStudenti().length > 0 && !confirm("I dati attuali verranno sostituiti. Continuare?")) {
        return;
    }
    caricaDatiDemo();
    aggiornaDashboard();
}

function azioneCancellaDati() {
    if (confirm("Vuoi davvero cancellare studenti e voti?")) {
        cancellaTuttiIDati();
        aggiornaDashboard();
    }
}

aggiornaDashboard();
