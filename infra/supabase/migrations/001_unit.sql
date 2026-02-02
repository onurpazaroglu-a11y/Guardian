-- Base setup and extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Global settings or enums if needed
DO $$ BEGIN
    CREATE TYPE user_tier AS ENUM ('free', 'pro');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
