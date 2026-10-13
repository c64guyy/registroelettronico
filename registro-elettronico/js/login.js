/* LOGIN.JS - pagina di accesso */

// Se sono già loggato vado direttamente alla dashboard
if (getUtente() !== null) {
    location.replace("dashboard.html");
}

function login() {
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    // 1) Validazione dei formati
    const errori = raccogliErrori([
        validaEmail(email),
        validaPasswordLogin(password)
    ]);
    if (errori.length > 0) {
        mostraErrori("messaggi", errori);
        return;
    }

    // 2) Controllo credenziali (FINTO: per ora confrontiamo con l'utente demo)
    if (email !== UTENTE_DEMO.email || password !== UTENTE_DEMO.password) {
        mostraErrori("messaggi", ["Email o password non corrette."]);
        return;
    }

    // 3) Salvo la sessione come stringa JSON (mai la password!) e cambio pagina
    const sessione = { email: UTENTE_DEMO.email, nome: UTENTE_DEMO.nome };
    sessionStorage.setItem(CHIAVE_SESSIONE, JSON.stringify(sessione));
    location.href = "dashboard.html";
}
