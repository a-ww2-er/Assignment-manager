/*
  Warnings:

  - You are about to drop the column `courseCode` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the `_AssignmentToFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CourseLecturer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `courseId` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_AssignmentToFile` DROP FOREIGN KEY `_AssignmentToFile_A_fkey`;

-- DropForeignKey
ALTER TABLE `_AssignmentToFile` DROP FOREIGN KEY `_AssignmentToFile_B_fkey`;

-- DropForeignKey
ALTER TABLE `_CourseLecturer` DROP FOREIGN KEY `_CourseLecturer_A_fkey`;

-- DropForeignKey
ALTER TABLE `_CourseLecturer` DROP FOREIGN KEY `_CourseLecturer_B_fkey`;

-- AlterTable
ALTER TABLE `Assignment` DROP COLUMN `courseCode`,
    ADD COLUMN `courseId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Course` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Submission` ADD COLUMN `grade` INTEGER NULL DEFAULT 0,
    ADD COLUMN `gradedAt` DATETIME(3) NULL,
    ADD COLUMN `gradedById` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `matricNo` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_AssignmentToFile`;

-- DropTable
DROP TABLE `_CourseLecturer`;

-- CreateTable
CREATE TABLE `_CourseStudents` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CourseStudents_AB_unique`(`A`, `B`),
    INDEX `_CourseStudents_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `Assignment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_gradedById_fkey` FOREIGN KEY (`gradedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseStudents` ADD CONSTRAINT `_CourseStudents_A_fkey` FOREIGN KEY (`A`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseStudents` ADD CONSTRAINT `_CourseStudents_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
