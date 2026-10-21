/* COOKIE.JS - banner cookie delle pagine di accesso
   Compare ogni volta che la pagina viene aperta o ricaricata. */

const CHIAVE_COOKIE = "consensoCookie";   // valori: "accettati" | "rifiutati"

function scegliCookie(scelta) {
    try {
        localStorage.setItem(CHIAVE_COOKIE, scelta);
    } catch (e) {
        // se il browser blocca lo storage, chiudiamo comunque il banner
    }
    const banner = document.getElementById("bannerCookie");
    if (banner !== null) {
        banner.remove();
    }
}

function creaBannerCookie() {
    const banner = document.createElement("div");
    banner.id = "bannerCookie";
    banner.className = "banner-cookie";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Consenso ai cookie");

    const testo = document.createElement("p");
    testo.textContent = "This site uses cookies and similar tools to make it work and to remember your preferences. " +
        "You can accept or reject them.";

    const azioni = document.createElement("div");
    azioni.className = "banner-cookie-azioni";

    const rifiuta = document.createElement("button");
    rifiuta.type = "button";
    rifiuta.className = "btn btn-secondario";
    rifiuta.textContent = "Refiute";
    rifiuta.onclick = function () { scegliCookie("rifiutati"); };

    const accetta = document.createElement("button");
    accetta.type = "button";
    accetta.className = "btn";
    accetta.textContent = "Allow";
    accetta.onclick = function () { scegliCookie("accettati"); };

    azioni.appendChild(rifiuta);
    azioni.appendChild(accetta);
    banner.appendChild(testo);
    banner.appendChild(azioni);
    document.body.appendChild(banner);
}

creaBannerCookie();
