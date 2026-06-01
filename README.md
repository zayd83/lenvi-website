# Lenvi Letselschade — Website

Persoonlijke juridische bijstand voor letselschade na verkeersongevallen.

## Structuur

```
lenvi-website/
├── index.html              ← Homepage
├── css/
│   ├── variables.css       ← Kleuren, fonts, tokens
│   ├── base.css            ← Reset & typografie
│   ├── components.css      ← Buttons, forms, WhatsApp
│   └── layout.css          ← Alle sectie-specifieke styling
├── js/
│   └── main.js             ← Scroll reveal animatie
├── assets/
│   ├── images/             ← Logo, portretfoto's
│   └── icons/              ← Favicon
├── netlify.toml            ← Netlify config (headers, caching)
├── .gitignore
└── README.md
```

## Lokaal draaien

Geen build step nodig. Open `index.html` direct in de browser, óf serve met Live Server (VS Code extensie) voor live reload.

**VS Code Live Server:**
1. Installeer extensie "Live Server" (Ritwick Dey)
2. Rechtsklik op `index.html` → "Open with Live Server"
3. Site opent op `http://127.0.0.1:5500`

## Deployen naar Netlify

### Optie 1 — Drag & Drop (snelste)
1. Ga naar [app.netlify.com/drop](https://app.netlify.com/drop)
2. Sleep de hele `lenvi-website` map erin
3. Klaar — krijg direct een live URL

### Optie 2 — Git + Auto-deploy (aanbevolen)
1. Push naar GitHub/GitLab:
   ```bash
   cd lenvi-website
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <jouw-repo-url>
   git push -u origin main
   ```
2. Op Netlify: "Add new site" → "Import from Git"
3. Selecteer repo → Deploy. Klaar.
4. Elke push naar `main` triggert automatisch een nieuwe deploy.

## Contactformulier (Netlify Forms)

Het formulier is al voorbereid voor Netlify Forms (gratis t/m 100 submissions per maand).

Na deploy:
1. Ga naar Netlify dashboard → Forms
2. Submissions verschijnen daar automatisch
3. Stel onder "Forms → Settings" een notificatie in naar `ne.essalhi@hotmail.com`

## Nog aan te passen

- [ ] Echt logo plaatsen (in header + footer + `assets/icons/favicon.svg`)
- [ ] Portretfoto Nasr toevoegen (`assets/images/nasr.jpg`) en monogram-placeholder vervangen
- [ ] E-mailadres `contact@lenvi.nl` bevestigen of vervangen
- [ ] Privacybeleid + Algemene voorwaarden pagina's aanmaken
- [ ] KVK-nummer in footer toevoegen (verplicht voor zakelijke websites)

## Kleuren & Typografie

Alle design tokens staan in `css/variables.css` — daar pas je centraal kleuren en fonts aan.

**Kleurpalet:**
- Navy: `#0E2444`
- Oker: `#B89968`
- Cream: `#F5F1EB`

**Fonts:**
- Display: Fraunces (serif)
- Body: Manrope (sans-serif)

---

Gebouwd door Nexa Marketing.
