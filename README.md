# Photo Opp Challenge

Aplicacao full stack para captura e distribuicao de fotos via QR Code.

## Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- Axios
- qrcode.react

### Backend
- Node.js
- Express

## Estrutura

- `frontend/` -> aplicacao React
- `backend/` -> API Node/Express

## Pre requisitos

- Node.js 20+ (recomendado LTS)
- npm 10+

## Como rodar localmente

Abra dois terminais: um para backend e outro para frontend.

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

API padrao: `http://localhost:3001`

Health check:

```bash
curl http://localhost:3001/health
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

App padrao: `http://localhost:5173`

## Variaveis de ambiente (frontend)

O frontend usa por padrao `http://localhost:3001`.

Se quiser alterar, crie `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

## Scripts uteis

### Backend (`backend/package.json`)
- `npm run dev` -> sobe com nodemon
- `npm start` -> sobe sem nodemon

### Frontend (`frontend/package.json`)
- `npm run dev` -> modo desenvolvimento
- `npm run build` -> build de producao
- `npm run preview` -> serve o build local
- `npm run lint` -> lint
