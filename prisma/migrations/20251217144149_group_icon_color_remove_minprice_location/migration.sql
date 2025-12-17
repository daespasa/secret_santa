/*
  Warnings:

  - You are about to drop the column `location` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `priceMin` on the `Group` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceMax" REAL,
    "eventDate" DATETIME,
    "drawDeadline" DATETIME,
    "rules" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "joinToken" TEXT NOT NULL,
    "drawnAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminUserId" INTEGER NOT NULL,
    CONSTRAINT "Group_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Group" ("adminUserId", "createdAt", "description", "drawDeadline", "drawnAt", "eventDate", "id", "joinToken", "name", "priceMax", "rules") SELECT "adminUserId", "createdAt", "description", "drawDeadline", "drawnAt", "eventDate", "id", "joinToken", "name", "priceMax", "rules" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
CREATE UNIQUE INDEX "Group_joinToken_key" ON "Group"("joinToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
