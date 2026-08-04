import {
  PrismaClient,
  ProjectStatus,
  Role,
  TaskPriority,
  TaskStatus,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const COMPANIES = [
  'IT Solutions', 'SoftUz', 'Web Studio', 'Dev Team', 'CodePro', 'Digital Nomad',
  'TechnoPark', 'Innova Group', 'SmartLine', 'NextGen Lab', 'CloudBridge', 'DataFlow',
  'Alpha Systems', 'Beta Digital', 'Gamma Tech', 'Delta Soft', 'Orbita IT', 'Zamon Tech',
  'Nur Systems', 'Global Link', 'Silk Road Soft', 'Uzinfocom Plus', 'MegaByte', 'PixelWorks',
  'Bright Code', 'Vertex Labs', 'Quantum IT', 'Nova Digital', 'Prime Soft', 'Apex Studio',
];

const FIRST_NAMES = [
  'Anvar', 'Dilshod', 'Azizbek', 'Jasur', 'Ibrohim', 'Sardor', 'Bekzod', 'Otabek',
  'Aziza', 'Nilufar', 'Malika', 'Gulnora', 'Kamola', 'Sevara', 'Zilola', 'Dilnoza',
  'Shohruh', 'Rustam', 'Farrux', 'Ulugbek',
];

const LAST_NAMES = [
  'Karimov', 'Alimov', 'Tursunov', 'Ahmedov', 'Yuldoshev', 'Saidov', 'Rahimov', 'Nazarov',
  'Ergashev', 'Qodirov', 'Sultonov', 'Mirzayev', 'Toshmatov', 'Xolmatov', 'Jo\'rayev',
];

const CITIES = [
  'Toshkent', 'Samarqand', 'Buxoro', 'Andijon', 'Farg\'ona', 'Namangan', 'Nukus',
  'Qarshi', 'Termiz', 'Navoiy', 'Jizzax', 'Guliston', 'Urganch',
];

const PROJECT_NAMES = [
  'CRM tizim', 'Online do\'kon', 'Mobil ilova', 'Landing page', 'Admin panel',
  'To\'lov integratsiyasi', 'Korporativ sayt', 'Yetkazib berish tizimi', 'HR platforma',
  'Analitika dashboard', 'Chatbot', 'Ombor tizimi', 'Bron qilish servisi', 'Ta\'lim portali',
  'Buxgalteriya moduli', 'Logistika tizimi', 'Telemedicina ilovasi', 'Ijtimoiy tarmoq',
  'Video platforma', 'IoT monitoring',
];

const TASK_TITLES = [
  'Login page yaratish', 'Ma\'lumotlar bazasi tuzish', 'API yozish', 'Dizayn tayyorlash',
  'Testlash', 'Deploy qilish', 'Hujjatlarni yozish', 'Kod review', 'Bug tuzatish',
  'Performance optimizatsiya', 'Xavfsizlik auditi', 'Responsive moslash',
  'To\'lov integratsiyasi', 'Email xabarnoma', 'Push notification', 'Kesh sozlash',
  'Backup skript', 'CI/CD sozlash', 'Analitika ulash', 'Til qo\'shish',
];

const USERS = [
  { fullname: 'John Doe', email: 'admin@minicrm.uz', password: 'Admin123!', role: Role.ADMIN },
  { fullname: 'Jane Smith', email: 'user@minicrm.uz', password: 'User123!', role: Role.USER },
  { fullname: 'Mike Johnson', email: 'mike@minicrm.uz', password: 'User123!', role: Role.USER },
  { fullname: 'Sarvar Karimov', email: 'sarvar@minicrm.uz', password: 'User123!', role: Role.USER },
  { fullname: 'Aziza Saidova', email: 'aziza@minicrm.uz', password: 'User123!', role: Role.USER },
  { fullname: 'Bekzod Aliyev', email: 'bekzod@minicrm.uz', password: 'User123!', role: Role.USER },
  { fullname: 'Nilufar Ergasheva', email: 'nilufar@minicrm.uz', password: 'User123!', role: Role.USER },
  { fullname: 'Otabek Nazarov', email: 'otabek@minicrm.uz', password: 'User123!', role: Role.ADMIN },
];

/** Seed har ishga tushganda bir xil natija bersin — takrorlanuvchi pseudo-random. */
let seedState = 42;

function random(): number {
  seedState = (seedState * 1103515245 + 12345) % 2147483648;
  return seedState / 2147483648;
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(random() * items.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

function dateWithinLastMonths(months: number): Date {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - months + 1, 1).getTime();
  return new Date(start + random() * (now.getTime() - start));
}

function futureDate(maxDaysAhead: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + randomInt(-20, maxDaysAhead));
  return date;
}

async function main(): Promise<void> {
  console.log('Eski maʼlumotlar tozalanmoqda...');
  await prisma.refreshToken.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  console.log('Foydalanuvchilar yaratilmoqda...');
  const users = await Promise.all(
    USERS.map(async (user) =>
      prisma.user.create({
        data: { ...user, password: await bcrypt.hash(user.password, 10) },
      }),
    ),
  );

  console.log('Mijozlar yaratilmoqda...');
  const customers = [];
  for (let index = 0; index < COMPANIES.length * 2; index += 1) {
    const company = COMPANIES[index % COMPANIES.length];
    const suffix = index >= COMPANIES.length ? ` ${Math.floor(index / COMPANIES.length) + 1}` : '';
    const fullname = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;

    customers.push(
      await prisma.customer.create({
        data: {
          companyName: `${company}${suffix}`,
          fullname,
          phone: `+9989${randomInt(0, 9)}${randomInt(1000000, 9999999)}`,
          email: `customer${index + 1}@${company.toLowerCase().replace(/[^a-z]/g, '')}.uz`,
          address: pick(CITIES),
          createdAt: dateWithinLastMonths(7),
        },
      }),
    );
  }

  console.log('Loyihalar yaratilmoqda...');
  const projectStatuses = Object.values(ProjectStatus);
  const projects = [];
  for (let index = 0; index < 56; index += 1) {
    const name = PROJECT_NAMES[index % PROJECT_NAMES.length];
    const suffix = index >= PROJECT_NAMES.length ? ` v${Math.floor(index / PROJECT_NAMES.length) + 1}` : '';

    projects.push(
      await prisma.project.create({
        data: {
          customerId: pick(customers).id,
          projectName: `${name}${suffix}`,
          description: `${name} loyihasi bo'yicha to'liq ishlab chiqish va joriy etish.`,
          status: pick(projectStatuses),
          deadline: futureDate(120),
          createdAt: dateWithinLastMonths(7),
        },
      }),
    );
  }

  console.log('Vazifalar yaratilmoqda...');
  const taskStatuses = Object.values(TaskStatus);
  const taskPriorities = Object.values(TaskPriority);
  for (let index = 0; index < 234; index += 1) {
    const title = TASK_TITLES[index % TASK_TITLES.length];

    await prisma.task.create({
      data: {
        projectId: pick(projects).id,
        assignedUser: random() > 0.1 ? pick(users).id : null,
        title,
        description: `${title} — loyihaning joriy bosqichi doirasida bajariladi.`,
        status: pick(taskStatuses),
        priority: pick(taskPriorities),
        deadline: futureDate(60),
        createdAt: dateWithinLastMonths(7),
      },
    });
  }

  const [customerCount, projectCount, taskCount] = await Promise.all([
    prisma.customer.count(),
    prisma.project.count(),
    prisma.task.count(),
  ]);

  console.log('\nSeed tugadi:');
  console.log(`  Foydalanuvchilar: ${users.length}`);
  console.log(`  Mijozlar:         ${customerCount}`);
  console.log(`  Loyihalar:        ${projectCount}`);
  console.log(`  Vazifalar:        ${taskCount}`);
  console.log('\nKirish maʼlumotlari:');
  console.log('  Admin: admin@minicrm.uz / Admin123!');
  console.log('  User:  user@minicrm.uz  / User123!');
}

main()
  .catch((error) => {
    console.error('Seed xatosi:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
