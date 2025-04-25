/*
  Warnings:

  - You are about to drop the column `startTime` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `presnt` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `present` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Class` DROP FOREIGN KEY `Class_supervisorId_fkey`;

-- DropIndex
DROP INDEX `Class_supervisorId_fkey` ON `Class`;

-- AlterTable
ALTER TABLE `Assignment` DROP COLUMN `startTime`,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Attendance` DROP COLUMN `presnt`,
    ADD COLUMN `present` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `Class` MODIFY `supervisorId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Result` ADD COLUMN `score` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Class` ADD CONSTRAINT `Class_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Teacher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
