-- Mini CRM — ma'lumotlar bazasi sxemasi (PostgreSQL)
--
-- Bu fayl Prisma migratsiyalari bilan bir xil natijani beradi va bazani
-- qo'lda yaratmoqchi bo'lganlar uchun mo'ljallangan. Odatdagi yo'l:
--   cd server && npx prisma migrate deploy
--
-- Qo'lda ishga tushirish:
--   psql -U postgres -d mini_crm -f docs/schema.sql

-- ============================================================================
-- Enumlar
-- ============================================================================

CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- ============================================================================
-- users
-- ============================================================================

CREATE TABLE "users" (
    "id"         SERIAL       PRIMARY KEY,
    "fullname"   VARCHAR(120) NOT NULL,
    "email"      VARCHAR(160) NOT NULL,
    "password"   VARCHAR(255) NOT NULL,
    "role"       "Role"       NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "users_email_key" ON "users" ("email");
CREATE INDEX "users_role_idx" ON "users" ("role");

-- ============================================================================
-- customers
-- ============================================================================

CREATE TABLE "customers" (
    "id"           SERIAL       PRIMARY KEY,
    "company_name" VARCHAR(160) NOT NULL,
    "fullname"     VARCHAR(120) NOT NULL,
    "phone"        VARCHAR(32)  NOT NULL,
    "email"        VARCHAR(160) NOT NULL,
    "address"      VARCHAR(255) NOT NULL,
    "created_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"   TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "customers_email_key" ON "customers" ("email");
CREATE INDEX "customers_company_name_idx" ON "customers" ("company_name");

-- ============================================================================
-- projects — bitta Customer bir nechta Projectga ega bo'lishi mumkin
-- ============================================================================

CREATE TABLE "projects" (
    "id"           SERIAL          PRIMARY KEY,
    "customer_id"  INTEGER         NOT NULL,
    "project_name" VARCHAR(160)    NOT NULL,
    "description"  TEXT,
    "status"       "ProjectStatus" NOT NULL DEFAULT 'PENDING',
    "deadline"     DATE,
    "created_at"   TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"   TIMESTAMP(3)    NOT NULL,

    CONSTRAINT "projects_customer_id_fkey"
        FOREIGN KEY ("customer_id") REFERENCES "customers" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "projects_customer_id_idx" ON "projects" ("customer_id");
CREATE INDEX "projects_status_idx" ON "projects" ("status");

-- ============================================================================
-- tasks — bitta Project bir nechta Taskga, bitta User bir nechta Taskga mas'ul
-- ============================================================================

CREATE TABLE "tasks" (
    "id"            SERIAL         PRIMARY KEY,
    "project_id"    INTEGER        NOT NULL,
    "assigned_user" INTEGER,
    "title"         VARCHAR(180)   NOT NULL,
    "description"   TEXT,
    "status"        "TaskStatus"   NOT NULL DEFAULT 'PENDING',
    "priority"      "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "deadline"      DATE,
    "created_at"    TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"    TIMESTAMP(3)   NOT NULL,

    CONSTRAINT "tasks_project_id_fkey"
        FOREIGN KEY ("project_id") REFERENCES "projects" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT "tasks_assigned_user_fkey"
        FOREIGN KEY ("assigned_user") REFERENCES "users" ("id")
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "tasks_project_id_idx" ON "tasks" ("project_id");
CREATE INDEX "tasks_assigned_user_idx" ON "tasks" ("assigned_user");
CREATE INDEX "tasks_status_idx" ON "tasks" ("status");
CREATE INDEX "tasks_priority_idx" ON "tasks" ("priority");

-- ============================================================================
-- refresh_tokens — server tomonda logout qilish uchun
-- ============================================================================

CREATE TABLE "refresh_tokens" (
    "id"         SERIAL       PRIMARY KEY,
    "token_hash" VARCHAR(255) NOT NULL,
    "user_id"    INTEGER      NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_user_id_fkey"
        FOREIGN KEY ("user_id") REFERENCES "users" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens" ("user_id");
