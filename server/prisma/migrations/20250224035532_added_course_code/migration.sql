/*
  Warnings:

  - The values [TEXT_RESPONSE] on the enum `Assignment_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `courseCode` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseCode` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `options` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Assignment` ADD COLUMN `courseCode` VARCHAR(191) NOT NULL,
    MODIFY `type` ENUM('DOCUMENT_UPLOAD', 'QUIZ') NOT NULL DEFAULT 'DOCUMENT_UPLOAD';

-- AlterTable
ALTER TABLE `Course` ADD COLUMN `courseCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Question` ADD COLUMN `options` VARCHAR(191) NOT NULL;
