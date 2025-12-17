/*
  Warnings:

  - The primary key for the `Assignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `giverUserId` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `receiverUserId` on the `Assignment` table. All the data in the column will be lost.
  - The primary key for the `GroupUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `giverParticipantId` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverParticipantId` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `GroupUser` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Step 1: Create new GroupUser table with id column
CREATE TABLE "new_GroupUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER,
    "guestName" TEXT,
    "guestEmail" TEXT,
    "isGuest" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GroupUser_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GroupUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Step 2: Copy data from old GroupUser to new GroupUser
INSERT INTO "new_GroupUser" ("createdAt", "groupId", "userId") 
SELECT "createdAt", "groupId", "userId" FROM "GroupUser";

-- Step 3: Create new Assignment table with new structure
CREATE TABLE "new_Assignment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupId" INTEGER NOT NULL,
    "giverParticipantId" INTEGER NOT NULL,
    "receiverParticipantId" INTEGER NOT NULL,
    CONSTRAINT "Assignment_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_giverParticipantId_fkey" FOREIGN KEY ("giverParticipantId") REFERENCES "new_GroupUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_receiverParticipantId_fkey" FOREIGN KEY ("receiverParticipantId") REFERENCES "new_GroupUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Step 4: Migrate Assignment data by mapping old userId to new GroupUser.id
INSERT INTO "new_Assignment" ("groupId", "giverParticipantId", "receiverParticipantId")
SELECT 
    a."groupId",
    (SELECT gu."id" FROM "new_GroupUser" gu WHERE gu."groupId" = a."groupId" AND gu."userId" = a."giverUserId"),
    (SELECT gu."id" FROM "new_GroupUser" gu WHERE gu."groupId" = a."groupId" AND gu."userId" = a."receiverUserId")
FROM "Assignment" a;

-- Step 5: Drop old tables
DROP TABLE "Assignment";
DROP TABLE "GroupUser";

-- Step 6: Rename new tables
ALTER TABLE "new_Assignment" RENAME TO "Assignment";
ALTER TABLE "new_GroupUser" RENAME TO "GroupUser";

-- Step 7: Create indexes
CREATE UNIQUE INDEX "Assignment_groupId_giverParticipantId_key" ON "Assignment"("groupId", "giverParticipantId");
CREATE UNIQUE INDEX "Assignment_groupId_receiverParticipantId_key" ON "Assignment"("groupId", "receiverParticipantId");
CREATE INDEX "GroupUser_groupId_idx" ON "GroupUser"("groupId");
CREATE INDEX "GroupUser_guestEmail_idx" ON "GroupUser"("guestEmail");
CREATE UNIQUE INDEX "GroupUser_groupId_userId_key" ON "GroupUser"("groupId", "userId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
