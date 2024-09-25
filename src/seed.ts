import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash da senha
  const hashedPassword = await bcrypt.hash('root', 10);

  // Criação do usuário
  const user = await prisma.user.create({
    data: {
      email: 'pietrosantos@blockcode.online',
      password: hashedPassword,
    },
  });

  console.log('Usuário criado:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
