/*
  Warnings:

  - You are about to drop the column `awayTeam` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `homeTeam` on the `Match` table. All the data in the column will be lost.
  - Added the required column `awayId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `homeId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "awayTeam",
DROP COLUMN "homeTeam",
ADD COLUMN     "awayId" TEXT NOT NULL,
ADD COLUMN     "homeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayId_fkey" FOREIGN KEY ("awayId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
