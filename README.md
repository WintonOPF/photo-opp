# Photo Opp

Aplicacao full stack para captura e distribuicao de fotos via QR Code, com autenticacao JWT, RBAC (`ADMIN` e `PROMOTER`) e persistencia em SQLite via Prisma.

## Link do projeto publicado

Frontend: https://photo-opp-3032c.web.app  
Backend API: https://photo-opp.onrender.com

## Estrutura atual

- `frontend/` - React + Vite
- `backend/` - Node.js + Express + Prisma + SQLite
- `firebase.json` - configuracao do Firebase Hosting (SPA)
- `render.yaml` - blueprint de deploy no Render

## Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- Axios

### Backend
- Node.js
- Express
- Prisma
- SQLite
- JWT
- bcrypt

## Variaveis de ambiente

### Backend (`backend/.env`)

Crie a partir de `backend/.env.example`.

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-me-in-production"
JWT_EXPIRES_IN="1d"
APP_URL="http://localhost:5173"
FRONTEND_URL="http://localhost:5173"
PORT=3001
```

Descricao:
- `DATABASE_URL`: caminho do SQLite.
- `JWT_SECRET`: segredo para assinatura dos tokens.
- `JWT_EXPIRES_IN`: expiracao do token JWT.
- `APP_URL`: URL do frontend usada no link de reset de senha.
- `FRONTEND_URL`: origem permitida no CORS.
- `PORT`: porta da API.

### Frontend (`frontend/.env`)

Crie a partir de `frontend/.env.example`.

```env
VITE_API_URL=http://localhost:3001
```

Descricao:
- `VITE_API_URL`: URL base da API consumida pelo frontend.

## Como rodar localmente

## 1) Clonar o repositorio

```bash
git clone <url-do-repositorio>
cd photo-opp
```

## 2) Backend

```bash
cd backend
npm install
copy .env.example .env
npm run prisma:migrate -- --name init_auth_photo
npm run prisma:seed
npm start
```

API local: `http://localhost:3001`

Health check:

```bash
curl http://localhost:3001/health
```

## 3) Frontend

Em outro terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend local: `http://localhost:5173`

## Como testar o sistema

1. Abra o frontend em `http://localhost:5173`.
2. Faça login com:
   - Admin: `admin@photoopp.local` / `admin`
   - Promoter: `promoter@photoopp.local` / `123456`
3. Valide chamadas da API:
   - `GET /health`
   - `POST /auth/login`
   - `GET /auth/me` (com token)
   - `GET /photos` (admin)

## Deploy

## Deploy do Frontend (Firebase Hosting)

1. Instalar Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Login no Firebase:

```bash
firebase login
```

3. Configurar variavel de ambiente de producao no frontend (`frontend/.env`):

```env
VITE_API_URL=https://seu-backend.onrender.com
```

4. Gerar build:

```bash
cd frontend
npm install
npm run build
```

5. Inicializar Hosting (somente na primeira vez):

```bash
cd ..
firebase init hosting
```

Durante o `init`:
- use o projeto Firebase desejado
- mantenha SPA rewrite para `index.html`
- nao sobrescreva o `firebase.json` existente se ele ja estiver correto

6. Deploy:

```bash
firebase deploy --only hosting
```

## Deploy do Backend (Render)

1. Criar um novo **Web Service** no Render e conectar o repositorio.
2. Definir:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run prisma:generate && npm run prisma:deploy`
   - **Start Command**: `npm start`
3. Configurar variaveis de ambiente no Render:
   - `DATABASE_URL=file:/var/data/dev.db`
   - `JWT_SECRET=<segredo-forte>`
   - `JWT_EXPIRES_IN=1d`
   - `APP_URL=https://seu-projeto.web.app`
   - `FRONTEND_URL=https://seu-projeto.web.app`
   - `PORT=3001`
4. Adicionar disco persistente para SQLite:
   - Mount path: `/var/data`
   - Tamanho: 1GB (ou maior)
5. Publicar o service e validar:
   - `https://seu-backend.onrender.com/health`

Observacao: o arquivo `render.yaml` ja foi preparado para esse fluxo.

## Fluxo recomendado de deploy

1. Publicar backend no Render.
2. Copiar URL da API publicada.
3. Atualizar `VITE_API_URL` no frontend para a URL da API.
4. Gerar build do frontend.
5. Publicar frontend no Firebase Hosting.

## Observacoes importantes

- CORS: a API aceita `http://localhost:5173` e `FRONTEND_URL`.
- Ambiente local e deploy usam URLs diferentes; ajuste variaveis corretamente.
- Se alterar a URL da API, atualize `VITE_API_URL` e gere novo build do frontend.
- SQLite em producao depende do disco persistente no Render.

## Scripts uteis

### Backend
- `npm run dev` - sobe com nodemon
- `npm start` - sobe sem nodemon
- `npm run prisma:migrate` - migracao em desenvolvimento
- `npm run prisma:deploy` - aplica migracoes em deploy
- `npm run prisma:seed` - seed inicial

### Frontend
- `npm run dev` - desenvolvimento
- `npm run build` - build de producao
- `npm run preview` - preview local do build
- `npm run lint` - lint
