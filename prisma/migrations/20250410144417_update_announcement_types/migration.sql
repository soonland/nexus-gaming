-- Create the new enum type
CREATE TYPE "AnnouncementType_new" AS ENUM ('INFO', 'ATTENTION', 'URGENT');

-- Update the column to use a temporary text type
ALTER TABLE "AdminAnnouncement" 
  ALTER COLUMN "type" TYPE TEXT 
  USING "type"::TEXT;

-- Map the old values to new values
UPDATE "AdminAnnouncement"
SET "type" = CASE "type"
  WHEN 'INFO' THEN 'INFO'
  WHEN 'WARNING' THEN 'ATTENTION'
  WHEN 'ERROR' THEN 'URGENT'
END;

-- Change the column type to the new enum
ALTER TABLE "AdminAnnouncement" 
  ALTER COLUMN "type" TYPE "AnnouncementType_new" 
  USING "type"::"AnnouncementType_new";

-- Drop the old enum type
DROP TYPE "AnnouncementType";

-- Rename the new enum type to the original name
ALTER TYPE "AnnouncementType_new" RENAME TO "AnnouncementType";
