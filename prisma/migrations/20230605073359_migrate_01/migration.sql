-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "prefered_place" INTEGER NOT NULL DEFAULT -1,
    "chose_place" INTEGER NOT NULL DEFAULT -1,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
