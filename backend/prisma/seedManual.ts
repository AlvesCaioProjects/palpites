import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import promptSync from 'prompt-sync';
import bcrypt from 'bcrypt';

const prompt = promptSync();
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco...');

  const name1 = prompt('Digite o nome do usuário 1: ');
  const nickname1 = prompt('Digite o nickname do usuário 1: ');
  const password1 = prompt('Digite a senha do usuário 1: ');
  const passwordHash1 = await bcrypt.hash(password1, 10);

  const user1 = await prisma.user.upsert({
    where: { nickname: nickname1 },
    update: {},
    create: {
      name: name1,
      nickname: nickname1,
      passwordHash: passwordHash1,
    },
  });

  const name2 = prompt('Digite o nome do usuário 2: ');
  const nickname2 = prompt('Digite o nickname do usuário 2: ');
  const password2 = prompt('Digite a senha do usuário 2: ');
  const passwordHash2 = await bcrypt.hash(password2, 10);

  const user2 = await prisma.user.upsert({
    where: { nickname: nickname2 },
    update: {},
    create: {
      name: name2,
      nickname: nickname2,
      passwordHash: passwordHash2,
    },
  });

  const teamName1 = prompt('Digite o nome do time 1: ');
  const team1 = await prisma.team.upsert({
    where: { name: teamName1 },
    update: {},
    create: { name: teamName1 },
  });

  const teamName2 = prompt('Digite o nome do time 2: ');
  const team2 = await prisma.team.upsert({
    where: { name: teamName2 },
    update: {},
    create: { name: teamName2 },
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

  const homeGuess = prompt(`Digite o palpite do time ${team1.name}: `);
  const awayGuess = prompt(`Digite o palpite do time ${team2.name}: `);

  const homeGuessConverted = parseInt(homeGuess, 10);
  const awayGuessConverted = parseInt(awayGuess, 10);

  let points = 0;
  if (homeGuessConverted === match.homeScore && awayGuessConverted === match.awayScore) {
    points = 3;
  } else if (
    (homeGuessConverted > awayGuessConverted && match.homeScore > match.awayScore) ||
    (homeGuessConverted < awayGuessConverted && match.homeScore < match.awayScore) ||
    (homeGuessConverted === awayGuessConverted && match.homeScore === match.awayScore)
  ) {
    points = 1;
  }

  await prisma.prediction.create({
    data: {
      matchId: match.id,
      userId: user1.id,
      leagueId: league.id,
      homeGuess: homeGuessConverted,
      awayGuess: awayGuessConverted,
      points,
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