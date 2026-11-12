
const UTENTI = {
    login_alunno: {
        email: "studente@mail.it",
        password: "Studente1!",
        ruolo: "studente",
        pagina: "dashboard_studente"
    },
    login_docente: {
        email: "docente@scuola.it",
        password: "Docente1!",
        ruolo: "docente",
        pagina: "dashboard_docente"
    },
    login_genitore: {
        email: "genitore@mail.it",
        password: "Genitore1!",
        ruolo: "genitore",
        pagina: "dashboard_genitore"
    }
};

const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

function mostraPsw() {
    const campo = document.getElementById("password");
    const bottone = document.getElementById("mostra-psw");
    const nascosta = campo.type === "password";

    campo.type = nascosta ? "text" : "password";
    bottone.setAttribute("aria-label", nascosta ? T.nascondiPsw : T.mostraPsw);
}

function mostraMessaggio(testo, ok) {
    const box = document.getElementById("messaggi");
    box.textContent = testo;
    box.style.color = ok ? "green" : "red";
}

function controllaCampo(campo, regex) {
    if (campo.value === "") {
        campo.style.borderColor = "";
        return;
    }
    campo.style.borderColor = regex.test(campo.value.trim()) ? "green" : "crimson";
}

function invioPassword(evento) {
    if (evento.key === "Enter") {
        login();
    }
}

function login() {
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        mostraMessaggio(T.campiVuoti, false);
        return;
    }
    if (!REGEX_EMAIL.test(email)) {
        mostraMessaggio(T.emailNonValida, false);
        return;
    }
    if (!REGEX_PASSWORD.test(password)) {
        mostraMessaggio(T.passwordNonValida, false);
        return;
    }

    const ruolo = Object.keys(UTENTI).find(function (classe) {
        return document.body.classList.contains(classe);
    });
    const utente = UTENTI[ruolo];

    if (email !== utente.email || password !== utente.password) {
        mostraMessaggio(T.credenzialiErrate, false);
        return;
    }

    
    let emailFiglio = "";
    if (utente.ruolo === "genitore") {
        emailFiglio = document.getElementById("email-alunno").value.trim().toLowerCase();
        if (!REGEX_EMAIL.test(emailFiglio)) {
            mostraMessaggio(T.emailAlunnoNonValida, false);
            return;
        }
        const trovato = leggi("studenti").some(function (s) {
            return s.email === emailFiglio;
        });
        if (!trovato) {
            mostraMessaggio(T.alunnoNonTrovato, false);
            return;
        }
    }

    const sessione = {
        email: utente.email,
        ruolo: utente.ruolo,
        emailFiglio: emailFiglio
    };
    const ricordami = document.getElementById("btnRicordami").checked;
    sessionStorage.removeItem("sessione");
    localStorage.removeItem("sessione");
    if (ricordami) {
        localStorage.setItem("sessione", JSON.stringify(sessione));
    } else {
        sessionStorage.setItem("sessione", JSON.stringify(sessione));
    }

    mostraMessaggio(T.accessoRiuscito, true);
    setTimeout(function () {
        window.location.href = utente.pagina + SUFFISSO + ".html";
    }, 800);
}

const campoEmail = document.getElementById("email");
const campoPassword = document.getElementById("password");
const campoEmailAlunno = document.getElementById("email-alunno");

campoEmail.addEventListener("input", function () {
    controllaCampo(campoEmail, REGEX_EMAIL);
});
campoPassword.addEventListener("input", function () {
    controllaCampo(campoPassword, REGEX_PASSWORD);
});
if (campoEmailAlunno) {
    campoEmailAlunno.addEventListener("input", function () {
        controllaCampo(campoEmailAlunno, REGEX_EMAIL);
    });
}
