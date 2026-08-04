# Mini CRM

Mijozlar, loyihalar va vazifalarni boshqarish uchun to'liq stack web ilova.
JWT autentifikatsiya, Admin/User rollari, to'rtta bo'lim uchun to'liq CRUD
(qidiruv, filtr, pagination bilan), statistik dashboard va mobil qurilmalarga
moslashgan interfeys.

## Jonli versiya

| | |
| --- | --- |
| **Ilova** | https://mini-crm-app-blue.vercel.app |
| **API** | https://mini-crm-api.vercel.app/api |
| **Swagger** | https://mini-crm-api.vercel.app/api/docs |

| Rol | Email | Parol |
| --- | --- | --- |
| Admin | `admin@minicrm.uz` | `Admin123!` |
| User | `user@minicrm.uz` | `User123!` |

Deploy qanday tashkil etilgani: [DEPLOYMENT.md](DEPLOYMENT.md) (Vercel + Neon).

> Baza bepul tarifda, harakatsizlikdan keyin uxlaydi — birinchi so'rov
> ~1-2 soniya kutishi mumkin.

---

## Texnologiyalar

| Backend (`server/`) | Frontend (`client/`) |
| --- | --- |
| NestJS 11 + TypeScript | React 19 + Vite + TypeScript |
| Prisma ORM | MUI v7 |
| PostgreSQL | TanStack Query v5 |
| Passport JWT (access + refresh) | React Router DOM v7 |
| class-validator / class-transformer | React Hook Form + Zod |
| Swagger (OpenAPI) | Axios, React Hot Toast |
| helmet, throttler, bcrypt | Recharts |

---

## Papka strukturasi

```
mini-crm/
├── client/                  # React SPA
│   └── src/
│       ├── api/             # Axios endpoint funksiyalari
│       ├── app/             # Router
│       ├── components/      # layout, guards, common, form
│       ├── constants/       # status/priority/role yorliqlari
│       ├── contexts/        # auth konteksti
│       ├── hooks/           # use-auth, use-debounce, use-list-controls, use-my-tasks
│       ├── lib/             # axios instance, formatlash, token storage
│       ├── pages/           # sahifalar (auth, dashboard, customers, ...)
│       ├── theme/           # MUI temasi va dizayn tokenlari
│       └── types/
├── server/                  # NestJS REST API
│   ├── prisma/              # schema.prisma, migrations/, seed.ts
│   └── src/
│       ├── common/          # decorators, dto, filters, guards, middleware, utils
│       ├── config/          # konfiguratsiya va .env validatsiyasi
│       ├── modules/         # auth, users, customers, projects, tasks, dashboard
│       └── prisma/          # PrismaService
└── docs/                    # SQL schema, Postman collection
```

---

## Talablar

- Node.js 20 yoki undan yuqori
- PostgreSQL 13 yoki undan yuqori
- npm 10+

---

## Ishga tushirish

### 1. Repozitoriyani klonlash

```bash
git clone https://github.com/AzimovAsadbek/mini-crm.git
```

### 2. Ma'lumotlar bazasi

Eng oson yo'li — loyiha ildizidagi `docker-compose.yml` orqali Postgres
konteynerini ko'tarish (host portida `5434`, lokal PostgreSQL bilan
to'qnashmasligi uchun):

```bash
docker compose up -d
```

Agar o'zingizning PostgreSQL serveringizdan foydalanmoqchi bo'lsangiz, shunchaki
`mini_crm` nomli baza yarating va `server/.env` dagi `DATABASE_URL` ni
o'zgartiring.

### 3. Backend

```bash
cd server
npm install
```

`.env.example` dan nusxa oling va o'z ma'lumotlaringizni yozing:

```bash
cp .env.example .env
```

`.env` mazmuni:

| O'zgaruvchi | Tavsif | Namuna |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL ulanish satri | `postgresql://minicrm:minicrm@localhost:5434/mini_crm?schema=public` |
| `PORT` | Server porti | `4000` |
| `API_PREFIX` | API prefiksi | `api` |
| `CORS_ORIGIN` | Ruxsat etilgan frontend manzili | `http://localhost:5173` |
| `JWT_ACCESS_SECRET` | Access token maxfiy kaliti (min. 16 belgi) | — |
| `JWT_ACCESS_EXPIRES_IN` | Access token muddati | `15m` |
| `JWT_REFRESH_SECRET` | Refresh token maxfiy kaliti (min. 16 belgi) | — |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token muddati | `7d` |
| `THROTTLE_TTL` / `THROTTLE_LIMIT` | So'rovlar cheklovi | `60000` / `200` |

Migratsiya va boshlang'ich ma'lumotlar:

```bash
npx prisma migrate deploy
```

```bash
npm run seed
```

Serverni ishga tushirish:

```bash
npm run start:dev
```

- API: <http://localhost:4000/api>
- Swagger: <http://localhost:4000/api/docs>

### 4. Frontend

```bash
cd client
npm install
```

```bash
npm run dev
```

- Ilova: <http://localhost:5173>

Vite `/api` so'rovlarini `http://localhost:4000` ga proksilaydi, shuning uchun
lokal ishlashda frontend uchun `.env` talab qilinmaydi. Backend boshqa manzilda
bo'lsa `client/.env` da `VITE_API_URL` ni belgilang
(namuna: [`client/.env.example`](client/.env.example)).

---

## Test uchun akkauntlar

`npm run seed` dan keyin quyidagi akkauntlar mavjud bo'ladi:

| Rol | Email | Parol |
| --- | --- | --- |
| Admin | `admin@minicrm.uz` | `Admin123!` |
| User | `user@minicrm.uz` | `User123!` |

---

## Rollar va ruxsatlar

| Bo'lim | ADMIN | USER |
| --- | --- | --- |
| Users | to'liq CRUD | ruxsat yo'q (faqat o'z profili) |
| Customers | to'liq CRUD | faqat o'qish |
| Projects | to'liq CRUD | faqat o'qish |
| Tasks | to'liq CRUD | o'qish + o'ziga biriktirilgan vazifa holatini yangilash |
| Dashboard / Profile | ✔ | ✔ |

Qo'shimcha xavfsizlik qoidalari: tizimda oxirgi admin o'chirilmaydi va roli
pasaytirilmaydi; foydalanuvchi o'z hisobini o'chira olmaydi; parol
o'zgartirilganda barcha refresh tokenlar bekor qilinadi.

---

## API

Interaktiv hujjat (Swagger):
<https://mini-crm-api.vercel.app/api/docs> — lokalda <http://localhost:4000/api/docs>

Postman kolleksiyasi:
[`docs/mini-crm.postman_collection.json`](docs/mini-crm.postman_collection.json).
Ichidagi `baseUrl` o'zgaruvchisi `http://localhost:4000/api` ga sozlangan —
jonli API'ni sinash uchun uni `https://mini-crm-api.vercel.app/api` ga
almashtiring. `login` so'rovi tokenlarni avtomatik saqlaydi.

### Auth

| Metod | Yo'l | Tavsif |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Ro'yxatdan o'tish |
| `POST` | `/api/auth/login` | Tizimga kirish |
| `POST` | `/api/auth/refresh` | Access tokenni yangilash |
| `POST` | `/api/auth/logout` | Chiqish (refresh token bekor qilinadi) |
| `GET` | `/api/auth/me` | Joriy foydalanuvchi |

### Resurslar

Har bir resurs bir xil naqshga ega:

| Metod | Yo'l | Tavsif |
| --- | --- | --- |
| `GET` | `/api/{resurs}` | Ro'yxat — `?page`, `?limit`, `?search`, `?sortBy`, `?sortOrder` |
| `GET` | `/api/{resurs}/:id` | Bitta yozuv |
| `POST` | `/api/{resurs}` | Yaratish |
| `PATCH` | `/api/{resurs}/:id` | Tahrirlash |
| `DELETE` | `/api/{resurs}/:id` | O'chirish |

`{resurs}` — `users`, `customers`, `projects`, `tasks`.

Qo'shimcha filtrlar:

- `GET /api/projects` — `?status`, `?customerId`
- `GET /api/tasks` — `?status`, `?priority`, `?projectId`, `?assignedUser`
  (`status` bir nechta qiymatni qabul qiladi: `?status=PENDING,IN_PROGRESS`)
- `GET /api/users` — `?role`

Yordamchi endpointlar: `/api/customers/select`, `/api/projects/select`,
`/api/users/assignable` — formalardagi select'lar uchun.

### Profil

Har qanday foydalanuvchi uchun ochiq (admin huquqi talab qilinmaydi):

| Metod | Yo'l | Tavsif |
| --- | --- | --- |
| `PATCH` | `/api/users/me` | O'z profilini yangilash (ism, email) |
| `PATCH` | `/api/users/me/password` | O'z parolini o'zgartirish |

### Dashboard

`GET /api/dashboard/stats` — jami mijozlar, loyihalar, vazifalar, tugallangan
va jarayondagi vazifalar soni, loyihalar holati bo'yicha taqsimot, oxirgi 7
oylik vazifa dinamikasi va oxirgi 5 ta vazifa.

### Javob formati

Ro'yxat:

```json
{
  "data": [],
  "meta": { "total": 128, "page": 1, "limit": 10, "totalPages": 13 }
}
```

Xatolik:

```json
{
  "statusCode": 404,
  "message": "Mijoz topilmadi",
  "error": "Not Found",
  "path": "/api/customers/999",
  "timestamp": "2026-08-04T09:24:00.000Z"
}
```

---

## Ma'lumotlar bazasi

Migratsiyalar: [`server/prisma/migrations/`](server/prisma/migrations/)
SQL sxema: [`docs/schema.sql`](docs/schema.sql)

### Jadvallar

**users** — `id`, `fullname`, `email` (unique), `password` (bcrypt), `role`, `created_at`, `updated_at`

**customers** — `id`, `company_name`, `fullname`, `phone`, `email` (unique), `address`, `created_at`, `updated_at`

**projects** — `id`, `customer_id`, `project_name`, `description`, `status`, `deadline`, `created_at`, `updated_at`

**tasks** — `id`, `project_id`, `assigned_user`, `title`, `description`, `status`, `priority`, `deadline`, `created_at`, `updated_at`

**refresh_tokens** — `id`, `token_hash`, `user_id`, `expires_at`, `created_at`

### Aloqalar

- Bitta **Customer** → bir nechta **Project** (`ON DELETE CASCADE`)
- Bitta **Project** → bir nechta **Task** (`ON DELETE CASCADE`)
- Bitta **User** → bir nechta **Task** (`ON DELETE SET NULL`)

### Enumlar

- `Role` — `ADMIN`, `USER`
- `ProjectStatus` — `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
- `TaskStatus` — `PENDING`, `IN_PROGRESS`, `COMPLETED`
- `TaskPriority` — `LOW`, `MEDIUM`, `HIGH`

---

## Sahifalar

| Sahifa | Yo'l | Tavsif |
| --- | --- | --- |
| Login | `/login` | Tizimga kirish |
| Register | `/register` | Ro'yxatdan o'tish |
| Dashboard | `/dashboard` | 5 ta statistika kartasi, 2 ta grafik, oxirgi vazifalar |
| Customers | `/customers` | Mijozlar CRUD |
| Projects | `/projects` | Loyihalar CRUD |
| Tasks | `/tasks` | Vazifalar CRUD |
| Users | `/users` | Foydalanuvchilar CRUD (faqat admin) |
| Profile | `/profile` | Profil, shaxsiy vazifa statistikasi, parolni o'zgartirish va sozlamalar |

Topbardagi qo'ng'iroq belgisi joriy foydalanuvchiga biriktirilgan ochiq
vazifalarni ko'rsatadi: badge — ularning soni, ro'yxat esa deadline bo'yicha
tartiblangan (muddati o'tganlar qizil, 3 kundan kam qolganlari sariq).

---

## Xavfsizlik

- Parollar `bcrypt` bilan hashlanadi (10 round)
- Access token qisqa muddatli (15 daqiqa), refresh token bazada hash holda
  saqlanadi va har yangilanishda rotatsiya qilinadi — bu server tomonda
  haqiqiy logout imkonini beradi
- Sessiya muddatini **backend** belgilaydi: frontend cookie'ning amal qilish
  vaqtini refresh tokenning `exp` da'vosidan o'qiydi, ya'ni client tomondan
  sessiyani uzaytirib bo'lmaydi. "Eslab qolish" belgilanmasa cookie'lar
  sessiya cookie bo'ladi va brauzer yopilganda o'chadi
- `helmet` HTTP sarlavhalari, CORS oq ro'yxati, `@nestjs/throttler` orqali
  so'rovlar cheklovi
- Global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`) — ortiqcha
  maydonlar rad etiladi
- Rollar `RolesGuard` orqali server tomonda tekshiriladi (frontenddagi
  yashirish faqat qulaylik uchun)
- Parol hech qachon API javobiga tushmaydi (Prisma `select` bilan cheklangan)

---

## Buyruqlar

### `server/`

| Buyruq | Tavsif |
| --- | --- |
| `npm run start:dev` | Dev rejim (watch) |
| `npm run build` | Production build |
| `npm run start:prod` | Production rejim |
| `npm run prisma:migrate` | Yangi migratsiya yaratish |
| `npm run prisma:deploy` | Mavjud migratsiyalarni qo'llash |
| `npm run prisma:studio` | Prisma Studio |
| `npm run seed` | Boshlang'ich ma'lumotlar |
| `npm run lint` | ESLint tekshiruvi (`lint:fix` — avtomatik tuzatish) |
| `npm run format` | Prettier bilan formatlash (`format:check` — faqat tekshirish) |

### `client/`

| Buyruq | Tavsif |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Build natijasini ko'rish |
| `npm run lint` | ESLint tekshiruvi (`lint:fix` — avtomatik tuzatish) |
| `npm run format` | Prettier bilan formatlash (`format:check` — faqat tekshirish) |

### Kod sifati

Ikkala paketda ham ESLint (flat config, `eslint.config.*`) va Prettier
sozlangan, bitta uslub bilan: 100 belgi kenglik, single quote, trailing comma.
`eslint-config-prettier` formatlash qoidalarini ESLint'dan olib tashlaydi —
ikkalasi bir-biriga xalaqit bermaydi.

Backendda `typescript-eslint` ning **type-aware** to'plami ishlaydi (tip
ma'lumotidan foydalanadigan qoidalar). Frontendda standart to'plam va React
Hooks qoidalari — React Compiler uchun mo'ljallangan yangi eksperimental
qoidalar yoqilmagan.

---

## Qo'shimcha imkoniyatlar

- **Deployment** — frontend, backend va baza to'liq ishlaydigan holda
  joylashtirilgan (Vercel + Neon), qarang [DEPLOYMENT.md](DEPLOYMENT.md).
- **Docker** — `docker-compose.yml` orqali PostgreSQL konteynerini bitta
  buyruq bilan ko'tarish.
- **Bildirishnomalar** — topbardagi qo'ng'iroq foydalanuvchiga biriktirilgan
  ochiq vazifalarni deadline bo'yicha ko'rsatadi.
