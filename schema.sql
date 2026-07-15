-- ====================================================================
-- Huwiyati AI (هويتي) — Database Schema Design
-- Target Database: Supabase / PostgreSQL
-- Description: Complete production-ready relational database schema with
-- Row Level Security (RLS) policies, foreign keys, indices, and types.
-- ====================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Table: users
-- Stores the primary identity and settings of the user.
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    google_uid VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    photo_url TEXT,
    age INT CHECK (age >= 10 AND age <= 25),
    country VARCHAR(100),
    language VARCHAR(10) DEFAULT 'ar' CHECK (language IN ('ar', 'en', 'fr')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_users_google_uid ON users(google_uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- RLS Policies for Users Table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON users FOR SELECT 
USING (auth.uid()::text = google_uid);

CREATE POLICY "Users can update their own profile" 
ON users FOR UPDATE 
USING (auth.uid()::text = google_uid);


-- ==========================================
-- 2. Table: user_profiles
-- Stores deep personal development information.
-- ==========================================
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    personality_profile JSONB, -- AI generated personality traits, confidence level
    interests TEXT[] NOT NULL DEFAULT '{}',
    strengths TEXT[] NOT NULL DEFAULT '{}',
    challenges TEXT[] NOT NULL DEFAULT '{}',
    dreams TEXT NOT NULL DEFAULT '',
    goals TEXT[] NOT NULL DEFAULT '{}'
);

-- RLS Policies for User Profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own personal profile" 
ON user_profiles FOR SELECT 
USING (user_id IN (SELECT id FROM users WHERE google_uid = auth.uid()::text));

CREATE POLICY "Users can modify their own personal profile" 
ON user_profiles FOR ALL 
USING (user_id IN (SELECT id FROM users WHERE google_uid = auth.uid()::text));


-- ==========================================
-- 3. Table: mentor_memory
-- Long-term AI memories extracted from conversations with Sana.
-- ==========================================
CREATE TABLE IF NOT EXISTS mentor_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    memory_type VARCHAR(50) NOT NULL CHECK (memory_type IN ('Goal', 'Preference', 'Skill', 'Achievement', 'Milestone')),
    content TEXT NOT NULL,
    importance_level VARCHAR(20) DEFAULT 'medium' CHECK (importance_level IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mentor_memory_user_id ON mentor_memory(user_id);

-- RLS Policies for Mentor Memory
ALTER TABLE mentor_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mentor memories" 
ON mentor_memory FOR SELECT 
USING (user_id IN (SELECT id FROM users WHERE google_uid = auth.uid()::text));

CREATE POLICY "Sana AI can insert/delete memories for authenticated user" 
ON mentor_memory FOR ALL 
USING (user_id IN (SELECT id FROM users WHERE google_uid = auth.uid()::text));


-- ==========================================
-- 4. Table: conversations
-- Audit trail and message history with Sana.
-- ==========================================
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);

-- RLS Policies for Conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own conversations" 
ON conversations FOR SELECT 
USING (user_id IN (SELECT id FROM users WHERE google_uid = auth.uid()::text));

CREATE POLICY "Users can record conversation message pairs" 
ON conversations FOR INSERT 
WITH CHECK (user_id IN (SELECT id FROM users WHERE google_uid = auth.uid()::text));


-- ==========================================
-- 5. Table: challenges
-- Predefined or dynamically suggested challenges.
-- ==========================================
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g. 'Communication', 'Creativity', 'Leadership', 'Learning'
    difficulty VARCHAR(50) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    points INT DEFAULT 100 NOT NULL
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read general challenges" 
ON challenges FOR SELECT 
TO authenticated 
USING (true);


-- ==========================================
-- 6. Table: user_progress
-- Tracks level, XP, completed tasks, and skill development.
-- ==========================================
CREATE TABLE IF NOT EXISTS user_progress (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    experience_points INT DEFAULT 0 NOT NULL,
    level INT DEFAULT 1 NOT NULL,
    completed_challenges JSONB DEFAULT '[]'::jsonb NOT NULL, -- list of challenge IDs completed
    badges JSONB DEFAULT '[]'::jsonb NOT NULL, -- list of unlocked badges with timestamp
    skills_progress JSONB DEFAULT '{}'::jsonb NOT NULL -- key-value store of development progress
);

-- RLS Policies for User Progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own progress" 
ON user_progress FOR SELECT 
USING (user_id IN (SELECT id FROM users WHERE google_uid = auth.uid()::text));

CREATE POLICY "Users can update their own progress" 
ON user_progress FOR ALL 
USING (user_id IN (SELECT id FROM users WHERE google_uid = auth.uid()::text));


-- ==========================================
-- 7. Table: opportunities
-- Development opportunities like scholarships, hackathons, etc.
-- ==========================================
CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    country VARCHAR(100) DEFAULT 'All',
    age_range VARCHAR(50) DEFAULT '10-25',
    category VARCHAR(100) NOT NULL, -- e.g. 'Hackathon', 'Scholarship', 'Competition', 'Course', 'Program'
    deadline TIMESTAMP WITH TIME ZONE,
    link VARCHAR(2048)
);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read opportunities" 
ON opportunities FOR SELECT 
TO authenticated 
USING (true);
