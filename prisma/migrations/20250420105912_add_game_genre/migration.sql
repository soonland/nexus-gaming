-- CreateEnum
CREATE TYPE "GameGenre" AS ENUM ('RPG', 'ACTION', 'ADVENTURE', 'SPORTS', 'RACING', 'STRATEGY', 'SHOOTER', 'PUZZLE', 'SIMULATION', 'FIGHTING');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "genre" "GameGenre";
