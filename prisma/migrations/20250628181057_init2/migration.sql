/*
  Warnings:

  - The primary key for the `Servico` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Servico" (
    "valor" REAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "id" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_Servico" ("descricao", "id", "valor") SELECT "descricao", "id", "valor" FROM "Servico";
DROP TABLE "Servico";
ALTER TABLE "new_Servico" RENAME TO "Servico";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
