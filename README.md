# 🚀 Taiga Clone - Client Web (React + Vite)

Aquest repositori conté el **Front-end** desenvolupat amb **React** per al **Tercer Lliurament** de l'assignatura d'Aplicacions i Serveis Web (ASW). 

L'aplicació és un client web SPA (Single Page Application) responsive que actua com a interfície gràfica per consumir l'API REST de Ruby on Rails implementada en el lliurament anterior, permetent una gestió àgil i dinàmica de les incidències.

🌍 **Entorn de Producció (Frontend en Vercel):** [https://frontend-asw-taiga-project.vercel.app/](https://frontend-asw-taiga-project.vercel.app/)  
⚙️ **API REST (Backend en Render):** [https://taiga-app.onrender.com/api/v1](https://taiga-app.onrender.com/)
🌲 **Taiga Oficial:** [Projecte a tree.taiga.io](https://tree.taiga.io/project/victorsalinasmontanuy-asw2526q2-it212)

---

## ✨ Funcionalitats Clau

- **Interfície d'Usuari Dinàmica:** Consum 100% dinàmic dels atributs de l'API (Estats, Tipus, Prioritats, Severitats).
- **Filtrat i Ordenació:** Delegació eficient de cerques, filtres complexos i ordenació directament al backend mitjançant paràmetres d'URL exactes.
- **Gestió d'Incidències:** Creació, edició, visualització en detall i eliminació d'Issues.
- **Inserció Massiva (Bulk):** Creació ràpida de múltiples incidències alhora.
- **Canvi d'Usuari Simulat:** Selecció ràpida d'usuari actiu (mitjançant injecció d'API Key al Header) per provar diferents rols i permisos.
- **Disseny Responsive:** Adaptació a dispositius mòbils i escriptori.
- **Pestanya Perfil:** Informació detallada de perfils.

---

## 🛠️ Tecnologies clau

| Capa | Tecnologia |
|------|-----------|
| Llibreria Core | [React](https://react.dev/) |
| Build Tool | [Vite](https://vitejs.dev/) |
| Llenguatge | JavaScript (ES6+) |
| Estils | CSS3 |
| Integració Backend | Fetch API RESTful |
| Hosting / CD | [Vercel](https://vercel.com/) |

---

## 💻 Requisits previs

Abans de començar, assegura't de tenir instal·lat al teu sistema:
* [Node.js](https://nodejs.org/) (Versió 18 o superior recomanada)
* **npm** (gestor de paquets, inclòs amb Node.js)
* **Git**

---

## 🚀 Guia de posada en marxa (Local)

Segueix aquests passos per configurar i executar el projecte al teu ordinador:

### 1. Clonar el repositori
Obre la terminal i executa:

```bash
git clone https://github.com/asw2526q2-it212/Frontend_ASW_Taiga_Project.git
cd Frontend_ASW_Taiga_Project
```
### 2. Instal·lar dependències
Baixa tots els paquets necessaris per fer funcionar el projecte:

```bash
npm install
```

### 3. Configurar variables d'entorn
Crea un fitxer anomenat .env a l'arrel del projecte (al mateix nivell que package.json) i afegeix-hi la URL del backend perquè el client sàpiga a quina API ha de trucar:

```bash
VITE_API_URL=https://taiga-app.onrender.com/api/v1
```

### 4. Executar l'entorn de desenvolupament
Arrenca el servidor de desenvolupament de Vite:

```bash
npm run dev
```

### 👥 Equip de Desenvolupament

Nom

Clàudia Galán Rodoreda

Sergi Malaguilla Bombín

Adrià Aguilar Garcia

Victor Salinas Montanuy

---

Professor: Quim Motger De La Encarnacion

Assignatura: Aplicacions i Serveis Web — Grau en Enginyeria Informàtica (UPC)

Convocatòria: Quadrimestre de Primavera, curs 2025/26


