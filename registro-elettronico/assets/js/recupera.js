// Pagina finta: non invia nessuna email, mostra solo la conferma.
function mostraMessaggio(testo, ok) {
    const box = document.getElementById("messaggi");
    box.textContent = testo;
    box.style.color = ok ? "green" : "red";
}

function recupera() {
    const campo = document.getElementById("email");
    const email = campo.value.trim().toLowerCase();

    if (email === "") {
        mostraMessaggio(T.inserisciEmail, false);
        return;
    }
    if (!REGEX_EMAIL.test(email)) {
        mostraMessaggio(T.emailNonValida, false);
        return;
    }

    mostraMessaggio(T.richiestaInviata.replace("{email}", email), true);
    campo.value = "";
}

function invioEmail(evento) {
    if (evento.key === "Enter") {
        recupera();
    }
}
