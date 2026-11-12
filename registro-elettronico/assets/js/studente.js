const utente = controllaAccesso("studente");

if (utente !== null) {
    mostraDatiStudente(utente.email, false);
}
