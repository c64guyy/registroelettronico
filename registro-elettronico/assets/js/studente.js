// ===== DASHBOARD STUDENTE (studente.js) =====
// Richiede storage.js e vista-studente.js caricati prima.

const utente = controllaAccesso("studente");

if (utente !== null) {
    scrivi("nome-utente", utente.nome);
    scrivi("nome-benvenuto", utente.nome.split(" ")[0]);
    mostraDatiStudente(utente.email, false);
}
