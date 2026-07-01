# JD PORTFOLIO

React + TypeScript + Vite personal portfolio.

## Backend

The contact form is powered by a Node.js backend (`server.js`) that sends emails via SendGrid or SMTP and stores messages in `data/messages.json`.

### 1. Configure environment variables

```bash
cp .env.example .env
```

Fill in:
- `GMAIL_USER` and `GMAIL_APP_PASSWORD` (Google App Password), or
- `SENDGRID_API_KEY` (recommended)
- `TO_EMAIL` (where contact messages are delivered)

### 2. Run locally

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:3001`

### 3. Deploy backend

Deploy the backend separately from the frontend. The free tier on most hosts is enough.

**Render (recommended)**
1. Push this repo to GitHub
2. Go to https://dashboard.render.com/create -> `New` -> `Web Service`
3. Connect your GitHub repo
4. Set:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add env vars: `GMAIL_USER`, `GMAIL_APP_PASSWORD` (or `SENDGRID_API_KEY`), `TO_EMAIL`, `NODE_ENV=production`
6. Deploy. You will get a URL like `https://portfolio-backend.onrender.com`

> A `render.yaml` is included for Infrastructure as Code deploys.

**Railway**
1. Install Railway CLI or use the web dashboard
2. Connect repo and deploy
3. Set the same env vars as above

After deploying, update your frontend `.env` (or hosting env) with:
```
VITE_API_URL=https://your-backend-url.com/api/contact
```

Then rebuild the frontend.

## Frontend

### Install

```bash
npm install
```

### Dev

```bash
npm run dev
```

### Build

```bash
npm run build
```

Preview the production build with `npm run preview`.
