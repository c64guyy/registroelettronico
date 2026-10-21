/* LOGIN.JS - pagina di accesso (docente, studente, genitore)
   Il ruolo viene letto dall'attributo data-ruolo del <body> della pagina. */

const RUOLO = document.body.dataset.ruolo;

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

    // 2) Controllo credenziali (FINTO: per ora confrontiamo con l'utente demo di QUESTO ruolo)
    const utente = UTENTI_DEMO[RUOLO];
    if (utente === undefined || email !== utente.email || password !== utente.password) {
        mostraErrori("messaggi", ["Email o password non corrette."]);
        return;
    }

    // 3) Salvo la sessione come stringa JSON (mai la password!) e cambio pagina
    const sessione = { email: utente.email, nome: utente.nome, ruolo: utente.ruolo };
    sessionStorage.setItem(CHIAVE_SESSIONE, JSON.stringify(sessione));
    location.href = "dashboard.html";
}

function togglePassword() {
    const input = document.getElementById('password');
    const btn = document.getElementById('togglePassword');
    const nascosta = input.type === 'password';

    input.type = nascosta ? 'text' : 'password';
    btn.textContent = nascosta ? '🙈' : '👁️';
    btn.setAttribute('aria-label', nascosta ? 'Nascondi password' : 'Mostra password');
}
