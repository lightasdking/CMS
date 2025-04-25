/*
  Warnings:

  - Added the required column `updatedAt` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Lesson` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `recurring` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `weekDay` INTEGER NULL;

-- AlterTable
ALTER TABLE `Teacher` MODIFY `name` VARCHAR(255) NOT NULL;

-- RenameIndex
ALTER TABLE `Lesson` RENAME INDEX `Lesson_classId_fkey` TO `Lesson_classId_idx`;

-- RenameIndex
ALTER TABLE `Lesson` RENAME INDEX `Lesson_subjectId_fkey` TO `Lesson_subjectId_idx`;

-- RenameIndex
ALTER TABLE `Lesson` RENAME INDEX `Lesson_teacherId_fkey` TO `Lesson_teacherId_idx`;
