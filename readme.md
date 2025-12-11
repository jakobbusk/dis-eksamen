# How to kør ReLive projektet lokalt (DIS eksamensprojekt)
Dette readme dokument beskriver hvordan du kan køre ReLive applikationen lokalt på din maskine.

## Forudsætninger
Før du kan køre projektet, skal du have følgende
- Nodejs
- PostgreSQL database
- Valkey/Redis database (optional)
- Understory API nøgle
- SendGrid konto (til at sende emails)
- Twilio konto (til at sende SMS)
- Cloudinary konto (til at hoste billeder)
- JWT secret (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

## Installation
### Kør webapplikationen
1. Åben en terminal og naviger til projektmappen
2. `npm install`
3. Ændre .env.example til .env og udfyld med nødvendige variabler
4. Åben din PostgreSQL database og kør SQL scriptet i `/database/migrations.sql`
5. Kør appen med `npm start`

### Kør cronjob
1. Åben en terminal og naviger til projektmappen
2. `node cronjob.js`


Github Copilot er blevet brugt under udviklingen af projektet.