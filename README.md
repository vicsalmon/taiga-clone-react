<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React Logo" width="80" />
  <h1>Taiga Clone - Client Web (React)</h1>
  <p><em>Interfície d'usuari SPA responsive per a la gestió i seguiment d'incidències.</em></p>

  <p>
     <b>💬 Català</b> | <a href="README.en.md">🌍 English</a>
  </p>

  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<br />

Aquest repositori conté el **Front-end** desenvolupat amb **React** per al **Tercer Lliurament** de l'assignatura d'Aplicacions i Serveis Web (ASW). 

L'aplicació és un client web SPA (Single Page Application) que actua com a interfície gràfica per consumir l'API REST de Ruby on Rails implementada en el lliurament anterior, permetent una gestió àgil i dinàmica de les incidències.

🌍 **Entorn de Producció (Frontend):** [Taiga React App (Vercel)](https://frontend-asw-taiga-project.vercel.app/)  
⚙️ **API REST (Backend):** [Taiga API (Render)](https://taiga-app.onrender.com/api/v1)  
🌍 **Entorn de Producció (Ruby APP):** [Taiga App (Render)](https://taiga-app.onrender.com)   
🌲 **Organització:** [Projecte Oficial a Taiga](https://tree.taiga.io/project/victorsalinasmontanuy-asw2526q2-it212)

---

## ✨ Demostració del Projecte

En el següent vídeo de 2 minuts es mostra la interacció completa amb la interfície d'usuari:

<div align="center">
  <video src="https://github.com/user-attachments/assets/98cd7efd-9372-4256-a1e0-18d69dfc3240" width="100%" controls="controls"></video>
</div>

---

## 🎯 Funcionalitats Clau

- **Interfície d'Usuari Dinàmica:** Consum 100% dinàmic dels atributs de l'API (Estats, Tipus, Prioritats, Severitats). S'adapta a la base de dades.
- **Filtrat i Ordenació:** Delegació eficient de cerques, filtres complexos i ordenació directament al backend mitjançant paràmetres d'URL exactes (`?status=New&sort=priority`).
- **Gestió d'Incidències:** Creació, edició, visualització en detall i eliminació d'Issues.
- **Inserció Massiva (Bulk):** Formulari especialitzat per a la creació ràpida de múltiples incidències alhora.
- **Canvi d'Usuari Simulat:** Selecció ràpida d'usuari actiu (mitjançant injecció dinàmica d'API Key als Headers de `fetch`) per provar diferents rols i permisos a la plataforma.
- **Pestanya Perfil:** Informació detallada de l'usuari actual.
- **Disseny Responsive:** Adaptació total (Mobile-First) a dispositius mòbils i escriptori utilitzant Flexbox/Grid CSS.

---

## 🛠️ Tecnologies clau

| Capa | Tecnologia |
|------|-----------|
| Llibreria Core | [React](https://react.dev/) |
| Build Tool | [Vite](https://vitejs.dev/) |
| Llenguatge | JavaScript (ES6+) |
| Estils | CSS3 |
| Integració Backend | Fetch API RESTful (Serveis asíncrons) |
| Hosting / CD | [Vercel](https://vercel.com/) |

---

## 🚀 Guia de posada en marxa (Local)

Abans de començar, assegura't de tenir instal·lat **Node.js** (v18+) i **npm**.

### 1. Clonar el repositori
Obre la terminal i executa:

```bash
git clone https://github.com/semabo29/Taiga_Issues_Clone_React.git
cd Taiga_Issues_Clone_React
```

### 2. Instal·lar dependències
Baixa tots els paquets necessaris per fer funcionar el projecte:

```bash
npm install
```
### 3. Configurar variables d'entorn

Crea un fitxer anomenat `.env` a l'arrel del projecte (al mateix nivell que `package.json`) i afegeix-hi la URL del backend:

```env
VITE_API_URL=https://taiga-app.onrender.com/api/v1
```

> **Nota:** Si vols treballar amb el backend en local, substitueix la URL anterior per:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 4. Executar l'entorn de desenvolupament

Arrenca el servidor de desenvolupament de Vite:

```bash
npm run dev
```

L'aplicació estarà disponible a:

```text
http://localhost:5173
```

---

## 👥 Equip de Desenvolupament

<div align="center">

| Nom                     |
| ----------------------- |
| Clàudia Galán Rodoreda  |
| Sergi Malaguilla Bombín |
| Adrià Aguilar Garcia    |
| Victor Salinas Montanuy |

</div>

**Professor:** Quim Motger De La Encarnacion

**Assignatura:** Aplicacions i Serveis Web — Grau en Enginyeria Informàtica (UPC)

**Convocatòria:** Quadrimestre de Primavera, curs 2025/26

---

## ⚖️ Llicència i Drets d'Autor

© 2026 **Clàudia Galán Rodoreda**, **Sergi Malaguilla Bombín**, **Adrià Aguilar Garcia** i **Victor Salinas Montanuy**. Tots els drets reservats.

Aquest repositori i el seu contingut són d'accés públic amb l'únic propòsit de servir com a portafolis personal i avaluació acadèmica.

No s'atorga cap llicència (implícita o explícita) per copiar, modificar, distribuir o utilitzar aquest codi, ja sigui amb finalitats comercials o no comercials, sense el permís previ i per escrit dels autors.

---

<div align="center">
  <sub>Desenvolupat com a part del projecte acadèmic de l'assignatura Aplicacions i Serveis Web (ASW) · UPC · Curs 2025/26</sub>
</div>


