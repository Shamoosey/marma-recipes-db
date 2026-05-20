/*
  Warnings:

  - You are about to drop the column `saved` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the `UserRecipes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserRecipes" DROP CONSTRAINT "UserRecipes_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "UserRecipes" DROP CONSTRAINT "UserRecipes_userId_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "saved",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserRecipes";

-- CreateTable
CREATE TABLE "UserSavedRecipes" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserSavedRecipes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserSavedRecipes" ADD CONSTRAINT "UserSavedRecipes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedRecipes" ADD CONSTRAINT "UserSavedRecipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
