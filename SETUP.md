# TechMetrix Setup Instructions

## Manual Supabase Setup

Since the automatic Supabase integration isn't working, follow these steps to set up Supabase manually:

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project name: "TechMetrix"
6. Enter a database password
7. Choose a region close to you
8. Click "Create new project"

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - Project URL
   - Project API Key (anon public)

### 3. Set Up Environment Variables

Create a `.env.local` file in your project root with:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
\`\`\`

### 4. Set Up Database Tables

1. In your Supabase dashboard, go to the SQL Editor
2. Run this SQL to create the necessary tables:

\`\`\`sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create repair_orders table
CREATE TABLE IF NOT EXISTS repair_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  technician_id UUID NOT NULL,
  year INTEGER NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  vin TEXT,
  labor_hours NUMERIC(5,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (technician_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS repair_orders_technician_id_idx ON repair_orders(technician_id);
CREATE INDEX IF NOT EXISTS repair_orders_created_at_idx ON repair_orders(created_at);
\`\`\`

### 5. Configure Row Level Security (RLS)

Run these SQL commands to set up proper security:

\`\`\`sql
-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on repair_orders table
ALTER TABLE repair_orders ENABLE ROW LEVEL SECURITY;

-- Policy for profiles table
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid()::text = email);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid()::text = email);

-- Policies for repair_orders table
CREATE POLICY "Users can view own repair orders" ON repair_orders
  FOR SELECT USING (auth.uid() = technician_id);

CREATE POLICY "Users can insert own repair orders" ON repair_orders
  FOR INSERT WITH CHECK (auth.uid() = technician_id);

CREATE POLICY "Users can update own repair orders" ON repair_orders
  FOR UPDATE USING (auth.uid() = technician_id);

CREATE POLICY "Users can delete own repair orders" ON repair_orders
  FOR DELETE USING (auth.uid() = technician_id);
\`\`\`

### 6. Install Dependencies

Make sure you have the required packages:

\`\`\`bash
npm install @supabase/supabase-js date-fns
\`\`\`

### 7. Test the Application

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Register a new account
4. Log in and test the dashboard functionality

## Troubleshooting

- If you get authentication errors, double-check your environment variables
- If database queries fail, ensure RLS policies are set up correctly
- Check the Supabase dashboard logs for any error messages
