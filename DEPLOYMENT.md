# Deploy — Vercel + Neon

Loyiha uchta qismdan iborat va uchalasi ham bepul tariflarga joylashtiriladi:

| Qism | Platforma | Narx |
| --- | --- | --- |
| Database (PostgreSQL) | [Neon](https://neon.com) | bepul, muddatsiz |
| Backend (NestJS) | [Vercel](https://vercel.com) | bepul (Hobby) |
| Frontend (React) | [Vercel](https://vercel.com) | bepul (Hobby) |

Bitta GitHub repodan **ikkita alohida Vercel loyihasi** yaratiladi:
biri `server/` papkasidan, ikkinchisi `client/` papkasidan.

> Tartib muhim: avval database, keyin backend, oxirida frontend.
> Frontend build paytida backend manzilini biladigan bo'lishi kerak.

---

## 1-qadam — Neon'da database yaratish

1. [neon.com](https://neon.com) ga kiring va bepul akkaunt oching.
2. **Create project** tugmasini bosing:
   - Project name: `mini-crm`
   - Postgres version: 17 (yoki eng oxirgisi)
   - Region: `AWS eu-central-1` (Yevropa — O'zbekistonga eng yaqini)
3. Yaratilgandan so'ng **Connection string** ko'rsatiladi. Ikkita variant bor —
   **Pooled connection** ni tanlang (hostida `-pooler` bo'ladi):

   ```
   postgresql://USER:PAROL@ep-xxxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

   Bu manzilni saqlab qo'ying — keyingi qadamlarda kerak bo'ladi.

> **Nega pooled?** Serverless funksiyalar har chaqiriqda yangi ulanish ochishi
> mumkin. Pooler ulanishlar sonini cheklab, bazaning limitiga urilishning
> oldini oladi.

### Migratsiya va boshlang'ich ma'lumotlar

Kompyuteringizda `server/` papkasida quyidagini bajaring (PowerShell):

```powershell
$env:DATABASE_URL="<Neon pooled connection string>"; npx prisma migrate deploy; npx prisma db seed
```

Bu jadvallarni yaratadi va demo ma'lumotlarni (foydalanuvchilar, mijozlar,
loyihalar, vazifalar) yozadi. Muvaffaqiyatli tugagach Neon panelidagi
**Tables** bo'limida jadvallarni ko'rasiz.

---

## 2-qadam — Backendni Vercel'ga joylash

### 2.1. Loyiha yaratish

1. [vercel.com/new](https://vercel.com/new) ga o'ting.
2. GitHub'ni ulang va `mini-crm` repositoriysini tanlang.
3. Sozlamalar:
   - **Project Name**: `mini-crm-api`
   - **Root Directory**: `server` ← **muhim**, `Edit` tugmasi orqali tanlanadi
   - **Framework Preset**: NestJS (Vercel o'zi aniqlaydi)
4. Hozircha **Deploy** tugmasini bosmang — avval environment variables kiriting.

### 2.2. Environment Variables

**Environment Variables** bo'limida quyidagilarni qo'shing:

| Nomi | Qiymati |
| --- | --- |
| `DATABASE_URL` | Neon pooled connection string |
| `JWT_ACCESS_SECRET` | tasodifiy 32+ belgili satr |
| `JWT_REFRESH_SECRET` | boshqa tasodifiy 32+ belgili satr |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `http://localhost:5173` (4-qadamda yangilanadi) |

Tasodifiy secret yaratish uchun:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Endi **Deploy** tugmasini bosing.

### 2.3. Tekshirish

Deploy tugagach Swagger ochilishi kerak:

```
https://mini-crm-api.vercel.app/api/docs
```

Login ishlayotganini tekshiring:

```bash
curl -X POST https://mini-crm-api.vercel.app/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@minicrm.uz\",\"password\":\"Admin123!\"}"
```

`accessToken` qaytsa — backend tayyor.

---

## 3-qadam — Frontendni Vercel'ga joylash

1. Yana [vercel.com/new](https://vercel.com/new) → o'sha `mini-crm` repositoriysi.
2. Sozlamalar:
   - **Project Name**: `mini-crm-app`
   - **Root Directory**: `client` ← **muhim**
   - **Framework Preset**: Vite
3. **Environment Variables**:

   | Nomi | Qiymati |
   | --- | --- |
   | `VITE_API_URL` | `https://mini-crm-api.vercel.app/api` |

   > Oxiridagi `/api` ni tushirib qoldirmang.

4. **Deploy** tugmasini bosing.

---

## 4-qadam — CORS'ni yopish

Frontend manzili ma'lum bo'lgach, backendga uni ruxsat berish kerak:

1. Vercel → `mini-crm-api` loyihasi → **Settings → Environment Variables**
2. `CORS_ORIGIN` qiymatini frontend manziliga o'zgartiring:

   ```
   https://mini-crm-app.vercel.app
   ```

   Bir nechta manzil kerak bo'lsa vergul bilan ajrating:

   ```
   https://mini-crm-app.vercel.app,http://localhost:5173
   ```

3. **Deployments** → oxirgi deploy → **Redeploy**.

---

## Tekshirish ro'yxati

- [ ] `https://mini-crm-app.vercel.app` ochiladi, login sahifasi ko'rinadi
- [ ] `admin@minicrm.uz` / `Admin123!` bilan kirish ishlaydi
- [ ] Dashboard raqamlari va grafiklar ko'rinadi
- [ ] Customers/Projects/Tasks/Users sahifalarida ma'lumot bor
- [ ] Yangi mijoz qo'shish, tahrirlash, o'chirish ishlaydi
- [ ] Qidiruv, filtr va sahifalash ishlaydi
- [ ] `https://mini-crm-api.vercel.app/api/docs` Swagger ochiladi
- [ ] Brauzer konsolida CORS xatosi yo'q

---

## Ma'lum cheklovlar

**Neon bepul tarifi** 5 daqiqa harakatsizlikdan keyin bazani uxlatadi.
Uzoq tanaffusdan keyingi birinchi so'rov ~1-2 soniya kutadi, keyingilari
odatdagidek tez. Oyiga 100 CU-soat va 0.5 GB joy beriladi — demo uchun
bemalol yetadi.

**Vercel Hobby tarifi** notijorat loyihalar uchun. Portfolio va test
topshiriqlari uchun ruxsat etilgan.

---

## Muammolar

**`PrismaClientInitializationError` yoki `Can't reach database server`**
`DATABASE_URL` noto'g'ri yoki `sslmode=require` yo'q. Neon'dan **pooled**
connection string'ni to'liq nusxalab qo'ying.

**Brauzerda `CORS policy` xatosi**
Backenddagi `CORS_ORIGIN` frontend manziliga to'liq mos kelishi kerak —
oxirida `/` bo'lmasin va `https://` bo'lsin. O'zgartirgandan keyin backendni
qayta deploy qiling.

**Frontend `Network Error` beradi**
`VITE_API_URL` build paytida kodga yoziladi. Uni o'zgartirgandan keyin
frontendni **qayta deploy** qilish shart — faqat env'ni saqlash yetarli emas.

**Login `401` qaytaradi**
Baza urug'lanmagan. 1-qadamdagi `prisma db seed` buyrug'ini bajaring.
