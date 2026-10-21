/* SCELTA.JS - pagina iniziale (scelta del ruolo) */

// Se sono già loggato vado direttamente alla dashboard
if (getUtente() !== null) {
    location.replace("dashboard.html");
}
