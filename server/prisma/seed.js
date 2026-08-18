const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany({});
  await prisma.score.deleteMany({});

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  await prisma.task.createMany({
    data: [
      { title: 'Finish assignment', important: true },
      { title: 'Review lecture notes', completed: true, important: false, completedAt: yesterday },
      { title: 'Complete coding challenge', completed: true, important: true, completedAt: today }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
