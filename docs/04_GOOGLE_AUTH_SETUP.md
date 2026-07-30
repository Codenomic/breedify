# How to Set Up Google Login for Breedify

This guide explains how to set up Google OAuth 2.0 credentials on the Google Cloud Console and integrate them with Supabase.

---

## PART A: Google Cloud Console Setup

### Step 1: Go to Google Cloud Console
1. Navigate to [https://console.cloud.google.com](https://console.cloud.google.com).
2. Sign in with your Google account.

### Step 2: Create a New Project
1. Click the project selection dropdown at the top navigation bar.
2. Select **New Project**.
3. Name your project: `Breedify`
4. Click **Create** and wait for the resource allocation. Select the project from the dropdown.

### Step 3: Configure the OAuth Consent Screen
1. Open the left sidebar menu, and navigate to **APIs & Services** → **OAuth consent screen**.
2. Select **External** as the User Type, and click **Create**.
3. Fill in the App Information:
   - **App name**: `Breedify`
   - **User support email**: Select your email address.
   - **Developer contact information**: Input your email.
4. Click **Save and Continue** through the scopes page.
5. In the **Test users** step, add your email address as a testing account.
6. Click **Save and Continue** and select **Back to Dashboard**.

### Step 4: Create OAuth Credentials
1. From the sidebar menu, navigate to **APIs & Services** → **Credentials**.
2. Click **+ Create Credentials** at the top, and select **OAuth client ID**.
3. Set the **Application type** to **Web application**.
4. Set the **Name** to `Breedify Web Client`.
5. Under **Authorized JavaScript origins**, click **Add URI** and input:
   - `http://localhost:5500` (Local frontend dev URL)
   - `https://your-vercel-url.vercel.app` (Add after deploying your frontend)
6. Under **Authorized redirect URIs**, click **Add URI** and input:
   - `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
   > [!NOTE]
   > You can copy your exact redirect URL from your Supabase Dashboard under: **Authentication** → **Providers** → **Google**.
7. Click **Create**.
8. Copy and save both the **Client ID** and the **Client Secret**.

---

## PART B: Connect to Supabase

### Step 5: Add Google Credentials to Supabase
1. Navigate to your Supabase project dashboard.
2. Open **Authentication** → **Providers** from the sidebar.
3. Locate **Google** and expand the options.
4. Toggle **Enable Google provider** to ON.
5. Paste your Google Cloud **Client ID** and **Client Secret**.
6. Click **Save**.

### Step 6: Test Google Login
1. Fire up your FastAPI backend: `uvicorn main:app --reload`
2. Open `frontend/login.html` (e.g. via Live Server).
3. Click **Sign in with Google**.
4. Follow the Google Sign-in flow.
5. Upon successful authorization, you should be redirected back to `index.html` via `auth-callback.html`.
6. Confirm the user records are updated in Supabase under **Authentication** → **Users**.
