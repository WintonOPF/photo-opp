# Photo Opp

Aplicacao full stack para captura e distribuicao de fotos via QR Code, com autenticacao JWT, RBAC (`ADMIN` e `PROMOTER`) e persistencia em SQLite via Prisma.

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
- Prisma
- SQLite
- JWT
- bcrypt

## Estrutura

- `frontend/` - aplicacao React
- `backend/` - API Node/Express + Prisma

## Pre-requisitos

- Node.js 20+ (recomendado LTS)
- npm 10+

## Variaveis de ambiente

### Backend (`backend/.env`)

Crie o arquivo a partir do exemplo:

```bash
cd backend
copy .env.example .env
```

Conteudo esperado:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-me-in-production"
JWT_EXPIRES_IN="1d"
APP_URL="http://localhost:5173"
PORT=3001
```

### Frontend (`frontend/.env`) opcional

Por padrao o frontend usa `http://localhost:3001`.
Se quiser alterar:

```env
VITE_API_URL=http://localhost:3001
```

## Como rodar localmente

Use dois terminais: um para backend e outro para frontend.

### 1) Backend (API + banco)

```bash
cd backend
npm install
npm run prisma:migrate -- --name init_auth_photo
npm run prisma:seed
npm run dev
```

Se `npm run dev` falhar no seu ambiente (ex.: erro de `nodemon`), use:

```bash
npm start
```

API padrao: `http://localhost:3001`
Health check: `GET /health`

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

App padrao: `http://localhost:5173`

## Contas iniciais

- Admin:
  - email: `admin@photoopp.local`
  - senha: `admin`
  - role: `ADMIN`
- Promoter seed:
  - email: `promoter@photoopp.local`
  - senha: `123456`
  - role: `PROMOTER`

## Rodar para deploy (producao)

## Backend

```bash
cd backend
npm install
npm run prisma:deploy
npm start
```

Observacoes:
- Defina variaveis de ambiente reais em producao (`DATABASE_URL`, `JWT_SECRET`, `APP_URL`, `PORT`).
- Use um `JWT_SECRET` forte.
- `prisma:seed` em producao e opcional.

## Frontend

Build:

```bash
cd frontend
npm install
npm run build
```

Os arquivos finais ficam em `frontend/dist/`.
Publique esse diretório em qualquer host estatico (Nginx, Vercel, Netlify, S3+CloudFront etc).

Teste local do build:

```bash
npm run preview
```

## Scripts uteis

### Backend (`backend/package.json`)
- `npm run dev` - sobe com nodemon
- `npm start` - sobe sem nodemon
- `npm run prisma:migrate` - cria/aplica migracoes em desenvolvimento
- `npm run prisma:deploy` - aplica migracoes em producao
- `npm run prisma:seed` - executa seed

### Frontend (`frontend/package.json`)
- `npm run dev` - modo desenvolvimento
- `npm run build` - build de producao
- `npm run preview` - serve build local
- `npm run lint` - lint
