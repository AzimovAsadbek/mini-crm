# Deploy

Loyiha Vercel va Neon'ning bepul tariflarida joylashtirilgan.

| Qism | Platforma | Manzil |
| --- | --- | --- |
| Frontend (React) | Vercel | https://mini-crm-app-blue.vercel.app |
| Backend (NestJS) | Vercel | https://mini-crm-api.vercel.app/api |
| Database (PostgreSQL) | Neon | — |

Swagger: https://mini-crm-api.vercel.app/api/docs

---

## Tuzilishi

Bitta repodan **ikkita Vercel loyihasi** yig'iladi — `Root Directory`
sozlamasi bilan ajratiladi:

| Vercel loyihasi | Root Directory | Preset |
| --- | --- | --- |
| `mini-crm-api` | `server` | NestJS |
| `mini-crm-app` | `client` | Vite |

Backend serverless funksiya sifatida ishlaydi. Shu sababli ikkita moslashuv
kerak bo'ldi:

- `server/package.json` da `postinstall: prisma generate` — Vercel
  `node_modules` ni keshlaydi va Prisma client eskirib qolmasligi kerak.
- Swagger sahifasi `SwaggerModule.setup()` o'rniga qo'lda render qilinadi
  (`server/src/main.ts`). Standart usul UI fayllarini diskdan o'qiydi, ular
  esa serverless paketga tushmaydi — natijada sahifa bo'sh chiqadi. Fayllar
  CDN'dan yuklanadi, `helmet` CSP shu hostga ochilgan.

Frontendda `client/vercel.json` barcha yo'llarni `index.html` ga yo'naltiradi,
aks holda `/customers` kabi manzillarni to'g'ridan-to'g'ri ochib bo'lmaydi.

---

## Environment variables

### `mini-crm-api` (backend)

| Nomi | Izoh |
| --- | --- |
| `DATABASE_URL` | Neon **pooled** connection string (hostida `-pooler`) |
| `JWT_ACCESS_SECRET` | tasodifiy 32+ belgi |
| `JWT_REFRESH_SECRET` | boshqa tasodifiy 32+ belgi |
| `CORS_ORIGIN` | frontend manzili (vergul bilan bir nechta bo'lishi mumkin) |
| `NODE_ENV` | `production` |

> **Pooled connection nega kerak?** Serverless funksiya har chaqiriqda yangi
> ulanish ochishi mumkin. Pooler ulanishlar sonini cheklab, bazaning
> limitiga urilishning oldini oladi.

Secret yaratish:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### `mini-crm-app` (frontend)

| Nomi | Izoh |
| --- | --- |
| `VITE_API_URL` | backend manzili `/api` bilan birga |

`VITE_API_URL` build paytida kodga yoziladi — o'zgartirgandan keyin frontendni
**qayta deploy qilish shart**, faqat saqlash yetarli emas.

---

## Bazani tayyorlash

Migratsiyalar uchun pooler emas, to'g'ridan-to'g'ri ulanish ishlatiladi
(host nomidan `-pooler` ni olib tashlang):

```bash
cd server && DATABASE_URL="<direct connection string>" npx prisma migrate deploy
```

```bash
cd server && DATABASE_URL="<direct connection string>" npx prisma db seed
```

---

## Qayta deploy qilish

```bash
npx vercel deploy --prod --cwd server
```

```bash
npx vercel deploy --prod --cwd client
```

---

## Cheklovlar

Neon bepul tarifi 5 daqiqa harakatsizlikdan keyin bazani uxlatadi — uzoq
tanaffusdan keyingi birinchi so'rov ~1-2 soniya kutadi, keyingilari odatdagidek
tez. Oyiga 100 CU-soat va 0.5 GB joy beriladi.

Vercel Hobby tarifi notijorat loyihalar uchun mo'ljallangan.
