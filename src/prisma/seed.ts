import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash das senhas
  const hashedPassword1 = await bcrypt.hash('root', 10);
  const hashedPassword2 = await bcrypt.hash('Le@ndroSilv@2101', 10);

  // Criação dos usuários
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'pietrosantos@blockcode.online',
        password: hashedPassword1,
      },
      {
        email: 'leandroafsilva84@gmail.com',
        password: hashedPassword2,
      },
    ],
  });

  console.log('Usuários criados:', users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
