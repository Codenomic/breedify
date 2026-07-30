# How to Set Up Supabase for Breedify

This guide explains how to set up your Supabase project, database tables, and Row Level Security (RLS) policies for Breedify.

## Step-by-Step Setup

### Step 1: Create a Supabase Account
1. Open your browser and navigate to [https://supabase.com](https://supabase.com).
2. Click **Start for free** and sign up using GitHub or email.

### Step 2: Create a New Project
1. In your Supabase dashboard, click **New Project**.
2. Select your default Organization.
3. Fill in project details:
   - **Name**: `Breedify`
   - **Database Password**: Create a strong password and **save it safely**.
   - **Region**: Select a region close to your target users (e.g., Southeast Asia (Singapore) for India).
4. Click **Create new project** (wait about 2 minutes for the database to provision).

### Step 3: Run the Database Schema
1. Click **SQL Editor** in the left navigation sidebar.
2. Click **New query** (or **Create a new query**).
3. Paste the following SQL schema code block entirely into the query panel:

```sql
-- 1. USER PROFILES TABLE
-- Extends Supabase's built-in auth.users table
CREATE TABLE IF NOT EXISTS public.profiles (
    id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name        TEXT,
    phone       TEXT,
    address     TEXT,
    avatar_url  TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. IDENTIFICATION HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.identifications (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    top_breed       TEXT NOT NULL,
    confidence      FLOAT,
    alternatives    JSONB,
    image_url       TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ROW LEVEL SECURITY (Users can only see their own data)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identifications ENABLE ROW LEVEL SECURITY;

-- Profiles: user can read and update only their own profile
CREATE POLICY "Read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Identifications: user can read and insert only their own records
CREATE POLICY "Read own identifications"
    ON public.identifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Insert own identifications"
    ON public.identifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 4. AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- This automatically creates a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

4. Click **Run** (green button). You should see `Success. No rows returned.`
5. Go to the **Table Editor** tab. You should see two tables: `profiles` and `identifications`.

### Step 4: Get Your API Keys
1. Click the gear icon (**Project Settings**) in the left sidebar.
2. Select **API**.
3. Copy these three values and paste them into your backend `.env` file:
   - **Project URL** → Paste as `SUPABASE_URL`
   - **anon (public)** key → Paste as `SUPABASE_ANON_KEY`
   - **service_role (secret)** key → Paste as `SUPABASE_SERVICE_KEY`
   > [!WARNING]
   > Keep your `service_role` key private. Never expose it in frontend files or git commits.

### Step 5: Enable Email Authentication
1. Select **Authentication** in the left sidebar.
2. Click **Providers**.
3. Locate the **Email** provider. Verify it is toggled **ON**.
4. For rapid testing, you can disable **Confirm email** (under Email options), but remember to turn it **ON** in production.

### Step 6: Test Connections
1. Start the backend: `uvicorn main:app --reload`
2. Open `http://localhost:8000/docs`.
3. Try the `POST /auth/signup` endpoint using dummy credentials.
4. Verify you can see the user record in your Supabase project under **Authentication** → **Users**.
