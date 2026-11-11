// ===== LOGIN (login.js) =====
// Richiede storage.js caricato PRIMA di questo file.
// Le password restano qui nel codice e NON vengono salvate nel localStorage
// (come dice la slide del prof). Nel browser si salva solo chi è loggato.

const UTENTI = {
    login_alunno: {
        email: "giulia.bianchi@mail.it",
        password: "Studente1!",
        ruolo: "studente",
        nome: "Giulia Bianchi",
        pagina: "dashboard_studente.html"
    },
    login_docente: {
        email: "docente@scuola.it",
        password: "Docente1!",
        ruolo: "docente",
        nome: "Marco Rossi",
        pagina: "dashboard_docente.html"
    },
    login_genitore: {
        email: "genitore@mail.it",
        password: "Genitore1!",
        ruolo: "genitore",
        nome: "Genitore di Giulia Bianchi",
        emailFiglio: "giulia.bianchi@mail.it",
        pagina: "dashboard_genitore.html"
    }
};

const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

function mostraPsw() {
    const campo = document.getElementById("password");
    const bottone = document.getElementById("mostra-psw");
    const nascosta = campo.type === "password";

    campo.type = nascosta ? "text" : "password";
    bottone.setAttribute("aria-label", nascosta ? "Nascondi password" : "Mostra password");
}

function mostraMessaggio(testo, ok) {
    const box = document.getElementById("messaggi");
    box.textContent = testo;
    box.style.color = ok ? "green" : "red";
}

// Colora il bordo del campo: verde se valido, rosso se no
function controllaCampo(campo, regex) {
    if (campo.value === "") {
        campo.style.borderColor = "";
        return;
    }
    campo.style.borderColor = regex.test(campo.value.trim()) ? "green" : "crimson";
}

// Premendo Invio nel campo password si fa il login
function invioPassword(evento) {
    if (evento.key === "Enter") {
        login();
    }
}

function login() {
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        mostraMessaggio("Inserisci email e password.", false);
        return;
    }

    if (!REGEX_EMAIL.test(email)) {
        mostraMessaggio("L'email non è in un formato valido.", false);
        return;
    }

    if (!REGEX_PASSWORD.test(password)) {
        mostraMessaggio("La password deve contenere almeno 8 caratteri, con maiuscola, minuscola, numero e simbolo.", false);
        return;
    }

    // Capisco il ruolo dalla classe del <body> (login_alunno, login_docente...)
    const ruolo = Object.keys(UTENTI).find(function (classe) {
        return document.body.classList.contains(classe);
    });
    const utente = UTENTI[ruolo];

    if (email !== utente.email || password !== utente.password) {
        mostraMessaggio("Email o password errate.", false);
        return;
    }

    // Salvo la sessione (senza password!)
    const sessione = {
        email: utente.email,
        ruolo: utente.ruolo,
        nome: utente.nome,
        emailFiglio: utente.emailFiglio || ""
    };
    const ricordami = document.getElementById("btnRicordami").checked;
    sessionStorage.removeItem("sessione");
    localStorage.removeItem("sessione");
    if (ricordami) {
        localStorage.setItem("sessione", JSON.stringify(sessione));
    } else {
        sessionStorage.setItem("sessione", JSON.stringify(sessione));
    }

    mostraMessaggio("Accesso riuscito! Reindirizzamento...", true);
    setTimeout(function () {
        window.location.href = utente.pagina;
    }, 800);
}

// Controllo "live" dei campi mentre si scrive
const campoEmail = document.getElementById("email");
const campoPassword = document.getElementById("password");

campoEmail.addEventListener("input", function () {
    controllaCampo(campoEmail, REGEX_EMAIL);
});
campoPassword.addEventListener("input", function () {
    controllaCampo(campoPassword, REGEX_PASSWORD);
});
