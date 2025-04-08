-- Custom script to hash existing passwords
-- Note: This is a one-time migration that will hash all existing plain-text passwords
-- The bcrypt implementation is handled in the application layer via prisma/seed.ts and src/app/api/users/route.ts

-- We don't modify the password column structure since it's already a String
-- The hashing is now enforced at the application level
