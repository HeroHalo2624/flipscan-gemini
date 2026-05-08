# 🔍 FlipScan AI

> Scan any item. Get instant resale prices for eBay, Kijiji, Facebook Marketplace & more.

Powered by **Google Gemini 1.5 Flash** vision AI. Built by Brian.

---

## 🚀 Deploy to Vercel

### Step 1 — Push to GitHub
```bash
cd flipscan
npm install
git init
git add .
git commit -m "FlipScan AI"
gh repo create flipscan-ai --public --source=. --push
```

### Step 2 — Import to Vercel
1. Go to **vercel.com/new**
2. Import your GitHub repo
3. Click **Deploy** (no build settings to change — Vercel auto-detects Vite)

### Step 3 — Add your Gemini API key
1. In Vercel dashboard → your project → **Settings → Environment Variables**
2. Add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your key from aistudio.google.com/apikey
   - **Environment:** Production ✓
3. Go to **Deployments → Redeploy**

That's it! The app is live.

---

## 🔑 Getting a Free Gemini API Key

1. Go to https://aistudio.google.com/apikey
2. Sign in with Google
3. Click **"Create API Key"**
4. Copy the key (starts with `AIzaSy...`)
5. Paste into Vercel env var OR into the app's Settings screen

---

## 🛠️ Local Development

```bash
npm install
# Create .env.local with your key:
echo "GEMINI_API_KEY=AIzaSy..." > .env.local
npm run dev
```

---

## 📁 Structure

```
flipscan/
├── src/
│   ├── pages/         # LandingPage, ScanPage, ResultsPage, HistoryPage, SettingsPage
│   ├── components/    # BottomNav
│   ├── api/           # analyze.js (Gemini client via serverless)
│   └── App.jsx
├── api/
│   └── analyze.js     # Vercel serverless → Gemini API
├── vercel.json
└── vite.config.js
```

---

## ☕ Support

https://buymeacoffee.com/brianm2624 — Built by Brian
