# How to `kør` dis-eksamen projektet lokalt
Dette readme dokument beskriver hvordan du kan køre dis-eksamen projektet lokalt på din maskine.

## Forudsætninger
Før du kan køre projektet, skal du have følgende
- Nodejs
- PostgreSQL database
- Valkey/Redis database (optional)
- SendGrid konto (til at sende emails)
- Twilio konto (til at sende SMS)

## Installation
1. `npm install`
2. Ændre .env.sample til .env og udfyld med nødvendige variabler
3. Åben din PostgreSQL database og kør SQL scriptet i `/database/migrations.sql`
4. Kør appen med `npm start`
