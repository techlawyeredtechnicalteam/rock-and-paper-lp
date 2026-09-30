-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN     "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "PageSection" (
    "id" TEXT NOT NULL,
    "pageSlug" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "eyebrow" TEXT,
    "title" TEXT,
    "description" TEXT,
    "image" TEXT,
    "linkUrl" TEXT,
    "linkLabel" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageSeo" (
    "id" TEXT NOT NULL,
    "pageSlug" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "ogImage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageSeo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PageSection_pageSlug_sectionKey_key" ON "PageSection"("pageSlug", "sectionKey");

-- CreateIndex
CREATE UNIQUE INDEX "PageSeo_pageSlug_key" ON "PageSeo"("pageSlug");
