# Tickets Client - Angular Dashboard

Questo repository contiene il modulo di frontend (sviluppato in **Angular**) dell'ecosistema a microservizi per la gestione delle segnalazioni e l'analisi dei dati di supporto.

L'applicazione funge da dashboard utente e si interfaccia direttamente con l'**API Gateway** locale per consumare i servizi aziendali in modo sicuro e centralizzato.

---

## 🚀 Funzionalità Principali

* **Gestione Ticket:** Visualizzazione, monitoraggio e interazione con le segnalazioni di varia apps.
* **Data Visualization & Analytics:** Rendering di due grafici interattivi che mostrano l'andamento delle aperture e chiusura.
* **Notifiche Real-Time (SSE):** Ricezione immediata di aggiornamenti sui nuovi ticket tramite **Server-Sent Events (SSE)**, implementati con gestione della riconnessione automatica e autenticazione tramite Bearer Token.

---

## 🏗️ Dettagli Tecnici & Architettura

### Comunicazione Real-Time (Server-Sent Events)
Per evitare inutili sprechi di risorse legati al polling HTTP sincrono, il client implementa una connessione persistente e unidirezionale. 
---

## 🛠️ Requisiti di Sistema

* [Node.js](https://nodejs.org/)
* Angular CLI (opzionale, integrato nelle dipendenze locali)
* L'infrastruttura backend attiva sulla porta `8080`.

---