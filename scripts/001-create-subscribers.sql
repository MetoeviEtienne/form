CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  level TEXT,
  motivation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
