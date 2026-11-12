// Funzioni condivise da tutte le pagine: va incluso per primo.

const lingua = document.documentElement.lang;
const SUFFISSO = lingua === "en" ? "_ing" : lingua === "es" ? "_spa" : "";

const TESTI = {
    it: {
        inserisciEmail: "Inserisci la tua email.",
        richiestaInviata: "Richiesta di cambio password inviata a {email}. Controlla la tua casella di posta.",
        decimale: ",",
        tipi: {},
        spazioEsaurito: "Impossibile salvare: spazio del browser esaurito.",
        vuotoVoti: "Nessun voto inserito.",
        vuotoAssenze: "Nessuna assenza o ritardo.",
        vuotoCompiti: "Nessun compito assegnato.",
        vuotoComunicazioni: "Nessuna comunicazione.",
        vuotoClassi: "Nessuna classe: aggiungi uno studente.",
        vuotoStudenti: "Nessuno studente inserito.",
        giustificata: "Giustificata",
        daGiustificare: "Da giustificare",
        giustifica: "Giustifica",
        classe: "Classe",
        perIl: "Per il",
        consegna: "consegna",
        nessunStudente: "Nessuno studente trovato con l'email {email}: il docente deve prima aggiungerlo.",
        campiVuoti: "Inserisci email e password.",
        emailNonValida: "L'email non è in un formato valido.",
        passwordNonValida: "La password deve contenere almeno 8 caratteri, con maiuscola, minuscola, numero e simbolo.",
        credenzialiErrate: "Email o password errate.",
        emailAlunnoNonValida: "Inserisci un'email valida per l'alunno.",
        alunnoNonTrovato: "Nessuno studente trovato con questa email: il docente deve prima aggiungerlo.",
        accessoRiuscito: "Accesso riuscito! Reindirizzamento...",
        mostraPsw: "Mostra password",
        nascondiPsw: "Nascondi password",
        compilaTutto: "Compila tutti i campi.",
        esisteGia: "Esiste già uno studente con questa email.",
        studenteAggiunto: "Studente aggiunto!",
        scegliStudenteMateria: "Scegli lo studente e scrivi la materia.",
        votoRange: "Il voto deve essere tra 1 e 10.",
        votoSalvato: "Voto salvato!",
        scegliStudente: "Scegli uno studente.",
        salvato: "Salvato!",
        compitoAssegnato: "Compito assegnato!",
        titoloTesto: "Scrivi titolo e testo.",
        comPubblicata: "Comunicazione pubblicata!",
        confermaCancella: "Vuoi davvero cancellare tutti i dati?",
        sceltaStudente: "-- scegli uno studente --"
    },
    en: {
        inserisciEmail: "Enter your email.",
        richiestaInviata: "Password change request sent to {email}. Check your inbox.",
        decimale: ".",
        tipi: { Scritto: "Written", Orale: "Oral", Pratico: "Practical", Assenza: "Absence", Ritardo: "Lateness" },
        spazioEsaurito: "Unable to save: browser storage is full.",
        vuotoVoti: "No grades entered.",
        vuotoAssenze: "No absences or lateness.",
        vuotoCompiti: "No homework assigned.",
        vuotoComunicazioni: "No notices.",
        vuotoClassi: "No classes: add a student.",
        vuotoStudenti: "No students added.",
        giustificata: "Justified",
        daGiustificare: "To be justified",
        giustifica: "Justify",
        classe: "Class",
        perIl: "Due on",
        consegna: "due",
        nessunStudente: "No student found with the email {email}: the teacher must add them first.",
        campiVuoti: "Enter your email and password.",
        emailNonValida: "The email is not in a valid format.",
        passwordNonValida: "The password must have at least 8 characters, with uppercase, lowercase, a number and a symbol.",
        credenzialiErrate: "Wrong email or password.",
        emailAlunnoNonValida: "Enter a valid email for the student.",
        alunnoNonTrovato: "No student found with this email: the teacher must add them first.",
        accessoRiuscito: "Login successful! Redirecting...",
        mostraPsw: "Show password",
        nascondiPsw: "Hide password",
        compilaTutto: "Fill in all the fields.",
        esisteGia: "A student with this email already exists.",
        studenteAggiunto: "Student added!",
        scegliStudenteMateria: "Choose the student and enter the subject.",
        votoRange: "The grade must be between 1 and 10.",
        votoSalvato: "Grade saved!",
        scegliStudente: "Choose a student.",
        salvato: "Saved!",
        compitoAssegnato: "Homework assigned!",
        titoloTesto: "Enter a title and a text.",
        comPubblicata: "Notice published!",
        confermaCancella: "Do you really want to delete all the data?",
        sceltaStudente: "-- choose a student --"
    },
    es: {
        inserisciEmail: "Introduce tu correo.",
        richiestaInviata: "Solicitud de cambio de contraseña enviada a {email}. Revisa tu bandeja de entrada.",
        decimale: ",",
        tipi: { Scritto: "Escrito", Orale: "Oral", Pratico: "Práctico", Assenza: "Ausencia", Ritardo: "Retraso" },
        spazioEsaurito: "No se puede guardar: el almacenamiento del navegador está lleno.",
        vuotoVoti: "No hay calificaciones.",
        vuotoAssenze: "No hay ausencias ni retrasos.",
        vuotoCompiti: "No hay tareas asignadas.",
        vuotoComunicazioni: "No hay comunicados.",
        vuotoClassi: "No hay clases: añade un estudiante.",
        vuotoStudenti: "No hay estudiantes añadidos.",
        giustificata: "Justificada",
        daGiustificare: "Pendiente de justificar",
        giustifica: "Justificar",
        classe: "Clase",
        perIl: "Para el",
        consegna: "entrega",
        nessunStudente: "No se ha encontrado ningún estudiante con el correo {email}: el profesor debe añadirlo primero.",
        campiVuoti: "Introduce el correo y la contraseña.",
        emailNonValida: "El correo no tiene un formato válido.",
        passwordNonValida: "La contraseña debe tener al menos 8 caracteres, con mayúscula, minúscula, número y símbolo.",
        credenzialiErrate: "Correo o contraseña incorrectos.",
        emailAlunnoNonValida: "Introduce un correo válido para el estudiante.",
        alunnoNonTrovato: "No se ha encontrado ningún estudiante con este correo: el profesor debe añadirlo primero.",
        accessoRiuscito: "¡Acceso correcto! Redirigiendo...",
        mostraPsw: "Mostrar contraseña",
        nascondiPsw: "Ocultar contraseña",
        compilaTutto: "Rellena todos los campos.",
        esisteGia: "Ya existe un estudiante con este correo.",
        studenteAggiunto: "¡Estudiante añadido!",
        scegliStudenteMateria: "Elige el estudiante y escribe la asignatura.",
        votoRange: "La calificación debe estar entre 1 y 10.",
        votoSalvato: "¡Calificación guardada!",
        scegliStudente: "Elige un estudiante.",
        salvato: "¡Guardado!",
        compitoAssegnato: "¡Tarea asignada!",
        titoloTesto: "Escribe el título y el texto.",
        comPubblicata: "¡Comunicado publicado!",
        confermaCancella: "¿Seguro que quieres borrar todos los datos?",
        sceltaStudente: "-- elige un estudiante --"
    }
};

const T = TESTI[lingua] || TESTI.it;

const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


function leggi(chiave) {
    return JSON.parse(localStorage.getItem(chiave)) || [];
}

function salva(chiave, dati) {
    try {
        localStorage.setItem(chiave, JSON.stringify(dati));
    } catch (errore) {
        alert(T.spazioEsaurito);
    }
}

function aggiungi(chiave, elemento) {
    const dati = leggi(chiave);
    dati.push(elemento);
    salva(chiave, dati);
}

function utenteCorrente() {
    const testo = sessionStorage.getItem("sessione") || localStorage.getItem("sessione");
    return JSON.parse(testo);
}

function controllaAccesso(ruoloAtteso) {
    const utente = utenteCorrente();
    if (utente === null || utente.ruolo !== ruoloAtteso) {
        window.location.href = "index" + SUFFISSO + ".html";
        return null;
    }
    return utente;
}

function esci() {
    sessionStorage.removeItem("sessione");
    localStorage.removeItem("sessione");
    window.location.href = "index" + SUFFISSO + ".html";
}

function media(voti) {
    if (voti.length === 0) {
        return "-";
    }
    let somma = 0;
    for (let i = 0; i < voti.length; i++) {
        somma += voti[i].voto;
    }
    return (somma / voti.length).toFixed(1).replace(".", T.decimale);
}

function numero(n) {
    return String(n).replace(".", T.decimale);
}

function tipo(valore) {
    return T.tipi[valore] || valore;
}

function classeVoto(voto) {
    if (voto >= 7) return "voto-alto";
    if (voto >= 6) return "voto-medio";
    return "voto-basso";
}

function formattaData(data) {
    const parti = data.split("-");
    return parti[2] + "/" + parti[1] + "/" + parti[0];
}

function oggi() {
    return new Date().toISOString().slice(0, 10);
}

// Evita che il testo scritto dall'utente venga eseguito come HTML
function pulisci(testo) {
    const div = document.createElement("div");
    div.textContent = testo;
    return div.innerHTML;
}

function mostraTabella(idCorpo, righe, colonne, testoVuoto) {
    const corpo = document.getElementById(idCorpo);
    if (righe.length === 0) {
        corpo.innerHTML = '<tr><td colspan="' + colonne + '">' + testoVuoto + '</td></tr>';
        return;
    }
    corpo.innerHTML = "";
    for (let i = 0; i < righe.length; i++) {
        corpo.innerHTML += "<tr>" + righe[i] + "</tr>";
    }
}

function mostraLista(idLista, elementi, testoVuoto) {
    const lista = document.getElementById(idLista);
    if (elementi.length === 0) {
        lista.innerHTML = "<li>" + testoVuoto + "</li>";
        return;
    }
    lista.innerHTML = "";
    for (let i = 0; i < elementi.length; i++) {
        lista.innerHTML += "<li>" + elementi[i] + "</li>";
    }
}

function scrivi(id, valore) {
    document.getElementById(id).textContent = valore;
}
