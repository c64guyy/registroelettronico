# Registro Elettronico (HTML + CSS + JavaScript)

Progetto scolastico - template di partenza.

## Come si avvia
Apri `index.html` nel browser (doppio clic, oppure con l'estensione *Live Server* di VS Code).

Credenziali di prova: `docente@scuola.it` / `Docente1!`
Dalla Dashboard puoi premere **Carica dati di esempio**.

## Struttura
```
registro-elettronico/
├── index.html          login
├── dashboard.html      riepilogo (statistiche, ultimi voti)
├── studenti.html       elenco + inserimento studenti
├── voti.html           inserimento + registro dei voti
├── css/style.css       stile unico per tutte le pagine
└── js/
    ├── dati.js         "livello dati": legge/salva JSON (oggi localStorage, domani database)
    ├── validazione.js  regex e funzioni valida...() lato front-end
    ├── common.js       sessione, messaggi di errore, funzioni di utilità
    ├── login.js  dashboard.js  studenti.js  voti.js    (un file per pagina)
```
Ordine di caricamento in ogni pagina: `dati.js` -> `validazione.js` -> `common.js` -> script della pagina
(con `defer` vengono eseguiti nell'ordine in cui sono scritti).

## Cosa riprende le lezioni
- **DOM**: `getElementById`, `createElement`, `textContent`, `style`/`className`
- **BOM**: `location.href`, `location.replace`, `confirm()`
- **JSON**: `JSON.stringify` / `JSON.parse` per salvare e leggere i dati
- **Stringhe**: `trim()`, `includes()`, `split()`, `length`
- **Validazione**: regex, controllo lunghezza, date (no futuro, età)

## Idee per estendere il progetto
1. Assenze e ritardi (nuova pagina + nuova lista in `dati.js`)
2. Pagella dello studente (media per materia)
3. Ruoli diversi (docente / studente / genitore)
4. Modifica di uno studente o di un voto
5. Registrazione nuovo docente con `REGEX_PSW` e conferma password
6. **Database**: riscrivere solo le funzioni di `dati.js` (e spostare login e validazione anche sul back-end)

## Attenzione
- La validazione front-end serve all'utente; la sicurezza vera la fa il back-end.
- Il login attuale è finto (utente scritto nel codice): non va mai fatto così in un progetto reale.
