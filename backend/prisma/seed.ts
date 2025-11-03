import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco...');

  const user1 = await prisma.user.upsert({
    where: { nickname: 'caio' },
    update: {},
    create: {
      name: 'Caio Alves',
      nickname: 'caio',
      passwordHash: '123456',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { nickname: 'ana' },
    update: {},
    create: {
      name: 'Ana Souza',
      nickname: 'ana',
      passwordHash: '123456',
    },
  });

  const team1 = await prisma.team.upsert({
    where: { name: 'Flamengo' },
    update: {},
    create: { name: 'Flamengo' },
  });

  const team2 = await prisma.team.upsert({
    where: { name: 'Palmeiras' },
    update: {},
    create: { name: 'Palmeiras' },
  });

  const match = await prisma.match.create({
    data: {
      homeId: team1.id,
      awayId: team2.id,
      matchDate: new Date(),
      homeScore: 2,
      awayScore: 1,
    },
  });

  const league = await prisma.league.create({
    data: {
      name: 'Liga Teste',
      createdBy: user1.id,
    },
  });

  await prisma.leagueMember.createMany({
    data: [
      { leagueId: league.id, userId: user1.id },
      { leagueId: league.id, userId: user2.id },
    ],
  });

  await prisma.prediction.create({
    data: {
      matchId: match.id,
      userId: user1.id,
      leagueId: league.id,
      homeGuess: 2,
      awayGuess: 1,
      points: 3,
    },
  });

  console.log('\nSeed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });