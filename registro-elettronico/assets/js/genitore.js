const utente = controllaAccesso("genitore");

// indice = posizione dell'assenza nell'array completo "assenze"
function giustifica(indice) {
    const assenze = leggi("assenze");
    assenze[indice].giustificata = true;
    salva("assenze", assenze);
    mostraDatiStudente(utente.emailFiglio, true);
}

if (utente !== null) {
    mostraDatiStudente(utente.emailFiglio, true);
}
