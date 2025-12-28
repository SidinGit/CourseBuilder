/*
  Warnings:

  - You are about to drop the column `duration` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Lesson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "duration",
DROP COLUMN "thumbnail",
DROP COLUMN "title",
DROP COLUMN "videoUrl";

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "ytVideoTitle" TEXT NOT NULL,
    "ytVideoId" TEXT NOT NULL,
    "ytVideoUrl" TEXT NOT NULL,
    "ytVideoThumbnail" TEXT NOT NULL,
    "ytVideoTags" TEXT[],
    "ytVideoDuration" INTEGER,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_ytVideoId_key" ON "Video"("ytVideoId");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
