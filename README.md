<div align="center">
  <h1>ASW Taiga Issue Tracker</h1>
  <p><em>Aplicació web per a la gestió i seguiment d'incidències inspirada en Taiga.</em></p>

  <p>
    💬 <b>Català</b> | <a href="README.en.md">🌍 English</a>
  </p>

  <img src="https://img.shields.io/badge/Ruby-CC342D?style=flat-square&logo=ruby&logoColor=white" alt="Ruby" />
  <img src="https://img.shields.io/badge/Rails-CC0000?style=flat-square&logo=ruby-on-rails&logoColor=white" alt="Rails" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" alt="Postgres" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white" alt="Render" />
</div>

<br />

Projecte desenvolupat per a l'assignatura d'Aplicacions i Serveis Web (ASW) a la Universitat Politècnica de Catalunya (UPC). Aquest projecte replica les funcionalitats core d'un Issue Tracker profesional, implementant una API RESTful robusta i una arquitectura escalable.

🌍 **Entorn de Producció:** [Taiga App (Render)](https://taiga-app.onrender.com) *(Nota: El servidor pot trigar uns segons a arrencar per les polítiques del tier gratuït).* 

🌲 **Organització:** [Organització del projecte a Taiga](https://tree.taiga.io/project/victorsalinasmontanuy-asw2526q2-it212)

---

## ✨ Demostració del Projecte

En el següent vídeo (1:30 min) es mostra el flux principal complet de l'aplicació:

https://github.com/user-attachments/assets/1831e4b5-19a0-4d83-a993-08b70420b00b

*(Nota: Funcionalitats com Visualitzar Perfil o Bulk Insert entre altres queden fora del Flux Principal del projecte pero estàn implementades).*

En la següent imatge es pot apreciar la visualització d'un Perfil que no es el nostre:

<img src="https://github.com/user-attachments/assets/3bad8143-0b86-4692-b960-77dc38f6c3ec" alt="Perfil" width="800" />

---

## 🛠️ Stack Tecnològic i Arquitectura

* **Framework Web:** Ruby on Rails 7.1.3 (API-first design)
* **Llenguatge:** Ruby 3.3.6
* **Base de Dades:** SQLite3 (Desenvolupament) / PostgreSQL (Producció)
* **Autenticació:** Google OAuth2 (OmniAuth)
* **Storage:** Active Storage integrat amb AWS S3
* **Infraestructura:** Dockeritzat i desplegat a Render
* **CI/CD:** GitHub Actions per automatitzar tests i desplegaments.

---

## 🔌 API REST (Nivell 2 Richardson)

El backend actua com una API RESTful estructurada per ser consumida per qualsevol client. S'ha posat especial èmfasi en la seguretat, la validació i la coherència de les dades.

* 📄 **Documentació:** Especificació completa OpenAPI a `/api/api.yml`.
* 🧪 **Prova-ho tu mateix:**
  1. Obre [Swagger Editor](https://editor.swagger.io/) i carrega el fitxer `api.yml`.
  2. Registra't a la nostra [App a Render](https://taiga-app.onrender.com) amb Google.
  3. Còpia la teva **API Key** des del teu perfil.
  4. A Swagger, fes clic a "Authorize", enganxa la clau i comença a fer peticions a la base de dades en producció.

---

## ⚙️ Desplegament i CI/CD

El projecte compta amb un pipeline d'integració contínua definit a `.github/workflows/cd.yml`. Cada integració a la branca `main` dispara un procés automatitzat que:
1. Construeix una imatge optimitzada a partir del `Dockerfile` inclòs.
2. Executa automàticament les migracions de la base de dades (PostgreSQL).
3. Desplega la nova versió a Render sense interrupció del servei.

---

## 🚀 Instal·lació Local

Si vols fer córrer el projecte al teu entorn local, necessitaràs Node i Ruby instal·lats.

```bash
# 1. Clonar el repositori
git clone [URL_DEL_TEU_REPOSITORI]
cd ASW_Taiga_Project

# 2. Instal·lar dependències
bundle install

# 3. Configurar variables d'entorn
# Crea un fitxer .env a l'arrel del projecte:
GOOGLE_CLIENT_ID=el_teu_client_id
GOOGLE_CLIENT_SECRET=el_teu_client_secret
AWS_ACCESS_KEY_ID=la_teva_access_key
AWS_SECRET_ACCESS_KEY=la_teva_secret_key
AWS_REGION=us-east-1
AWS_BUCKET=aswtaiga-bucket

# 4. Preparar la base de dades
rails db:prepare

# 5. Aixecar el servidor
bin/rails server -b 0.0.0.0
```

## Equip 

| Nom |
|-----|
| Clàudia Galán Rodoreda |
| Sergi Malaguilla Bombín |
| Adrià Aguilar Garcia |
| Victor Salinas Montanuy |

**Professor:** Quim Motger De La Encarnacion
**Assignatura:** Aplicacions i Serveis Web — Grau en Enginyeria Informàtica (UPC)  
**Convocatòria:** Quadrimestre de Primavera, curs 2025/26
