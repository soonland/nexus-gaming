-- Step 1: Add nullable slug column first
ALTER TABLE "Category" ADD COLUMN "slug" TEXT;

-- Step 2: Generate slugs from names for existing records
UPDATE "Category" 
SET "slug" = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'));

-- Step 3: Make slug required now that we have data
ALTER TABLE "Category" ALTER COLUMN "slug" SET NOT NULL;

-- Step 4: Add other new columns
ALTER TABLE "Category" ADD COLUMN "description" TEXT;
ALTER TABLE "Category" ADD COLUMN "parentId" TEXT;

-- Step 5: Create indexes and constraints
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");

-- Step 6: Add foreign key for self-referential relationship
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" 
FOREIGN KEY ("parentId") REFERENCES "Category"("id") 
ON DELETE SET NULL ON UPDATE CASCADE;
