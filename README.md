# Mini CRM

Mijozlar, loyihalar va vazifalarni boshqarish uchun to'liq stack web ilova.
JWT autentifikatsiya, Admin/User rollari, to'rtta bo'lim uchun to'liq CRUD
(qidiruv, filtr, pagination bilan), statistik dashboard va mobil qurilmalarga
moslashgan interfeys.

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
│       ├── contexts/        # auth va dark mode
│       ├── hooks/           # use-auth, use-debounce, use-list-controls
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
frontend uchun alohida `.env` talab qilinmaydi.

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

To'liq interaktiv hujjat: <http://localhost:4000/api/docs>
Postman uchun: [`docs/mini-crm.postman_collection.json`](docs/mini-crm.postman_collection.json)

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
- `GET /api/users` — `?role`

Yordamchi endpointlar: `/api/customers/select`, `/api/projects/select`,
`/api/users/assignable` — formalardagi select'lar uchun.

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
| Profile | `/profile` | Profil, parolni o'zgartirish va sozlamalar (Dark Mode) |

---

## Xavfsizlik

- Parollar `bcrypt` bilan hashlanadi (10 round)
- Access token qisqa muddatli (15 daqiqa), refresh token bazada hash holda
  saqlanadi va har yangilanishda rotatsiya qilinadi — bu server tomonda
  haqiqiy logout imkonini beradi
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

### `client/`

| Buyruq | Tavsif |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Build natijasini ko'rish |

---

## Qo'shimcha imkoniyatlar

- **Dark Mode** — Profile sahifasidagi sozlamalar bo'limida yoki topbar tugmasi
  orqali; tanlov `localStorage` da saqlanadi, birinchi kirishda tizim mavzusiga
  moslashadi.
- **Docker** — `docker-compose.yml` orqali PostgreSQL konteynerini bitta
  buyruq bilan ko'tarish.
