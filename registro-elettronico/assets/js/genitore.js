// ===== DASHBOARD GENITORE (genitore.js) =====
// Richiede storage.js e vista-studente.js caricati prima.

const utente = controllaAccesso("genitore");

// Il genitore giustifica un'assenza: la segna come giustificata nel foglio JSON
function giustifica(indice) {
    const assenze = leggi("assenze");
    assenze[indice].giustificata = true;
    salva("assenze", assenze);
    mostraDatiStudente(utente.emailFiglio, true);
}

if (utente !== null) {
    scrivi("nome-utente", utente.nome);
    mostraDatiStudente(utente.emailFiglio, true);
}
