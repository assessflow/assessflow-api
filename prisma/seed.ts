import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const user1Id = uuidv4();
  const user2Id = uuidv4();

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO "User" (id, email, name, "passwordHash", role, "createdAt", "updatedAt")
    VALUES 
      ($1, $2, $3, $4, $5::"Role", NOW(), NOW()),
      ($6, $7, $8, $9, $10::"Role", NOW(), NOW())
    ON CONFLICT (email) DO NOTHING;
    `,
    user1Id, 'admin@example.com', 'Admin User', 'hashedpassword1', 'ADMIN',
    user2Id, 'anon@test.test', 'Test User', 'hashedpassword2', 'USER'
  );

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO "GhostSession" (id, label, "createdAt", "userId")
    VALUES 
      ($1, $2, NOW(), $3),
      ($4, $5, NOW(), $6),
      ($7, $8, NOW(), NULL)
    ON CONFLICT (id) DO NOTHING;
    `,
    'session1', 'Admin session', user1Id,
    'session2', 'User session', user2Id,
    'session3', 'Orphan session'
  );
}

main()
  .then(() => {
    console.log('done seeding');
  })
  .catch((e) => {
    console.error('not done', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
