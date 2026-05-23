# Shams Zia — Personal Portfolio

> Data Engineer | Big Data | Spark | Hadoop | ETL Pipelines

A full-stack personal portfolio with neon gaming aesthetic, built with **React + Vite** (frontend) and **Node.js + Express** (backend).

---

## 🗂 Project Structure

```
portfolio/
├── src/
│   ├── App.jsx          ← Main React component (all sections)
│   └── main.jsx         ← React entry point
├── public/
│   └── videos/          ← ⚠️ PUT YOUR MP4 FILES HERE
├── server.js            ← Express backend (contact form API)
├── vite.config.js       ← Vite config (dev proxy → backend)
├── package.json
└── index.html
```

---

## 🚀 Setup & Run

### 1. Install dependencies
```bash
npm install
# Also install backend deps:
npm install express nodemailer
```

### 2. Add your videos
Copy all 4 `.mp4` files into:
```
public/videos/
```
File names expected (already set in App.jsx):
- `WhatsApp_Video_2026-03-22_at_10_11_01_PM__1_.mp4`
- `WhatsApp_Video_2026-03-22_at_10_11_01_PM.mp4`
- `WhatsApp_Video_2026-03-20_at_12_42_17_AM__1_.mp4`
- `WhatsApp_Video_2026-03-20_at_12_42_17_AM.mp4`

### 3. Run frontend (dev mode)
```bash
npm run dev
# → http://localhost:5173
```

### 4. Run backend (contact form)
```bash
node server.js
# → http://localhost:3001
```

### 5. Build for production
```bash
npm run build
# → /dist folder — deploy to Vercel, Netlify, VPS, etc.
```

---

## ✉️ Contact Form Setup (Gmail)
In `server.js`, set these env variables or update directly:
```
MAIL_USER=shamsiop7000@gmail.com
MAIL_PASS=your_gmail_app_password
```
Get a Gmail App Password at: https://myaccount.google.com/apppasswords

---

## 🌐 Deploy to Vercel (free)
```bash
npm install -g vercel
vercel
```
That's it — Vercel auto-detects Vite + React.

---

## 🎨 Customization
All content lives in `src/App.jsx`:
- **Skills** → edit the `skills` array in the `Skills` component
- **Projects** → edit the `projects` array in the `Projects` component
- **Contact info** → edit the info blocks in the `Contact` component
- **Colors** → change `#00ff88` (green), `#ff0080` (pink), `#00d4ff` (cyan) globally

---

Built with ⚡ by Shams Zia.
