# How to Deploy Breedify to Production

This document provides guidelines for deploying the Breedify backend to Render and the static frontend to Vercel.

---

## PART 1: DEPLOY BACKEND TO RENDER

### Step 1: Push Code to GitHub
1. Create a repository named `breedify` on GitHub.
2. Initialize Git locally and push the workspace code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/breedify.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Upload Model Files Using Git LFS
Since `best_resnet.pth` is larger than 90MB, it is highly recommended to track it using Git Large File Storage (LFS) to prevent push failures:
1. Install Git LFS:
   ```bash
   git lfs install
   ```
2. Track `.pth` files:
   ```bash
   git lfs track "*.pth"
   ```
3. Commit attributes and push the model file:
   ```bash
   git add .gitattributes models/best_resnet.pth
   git commit -m "Add model weights using LFS"
   git push origin main
   ```

### Step 3: Create Render Web Service
1. Sign up on [Render](https://render.com) using your GitHub account.
2. Select **New +** → **Web Service**.
3. Grant access to your `breedify` GitHub repository and select it.
4. Fill in these Settings:
   - **Name**: `breedify-backend`
   - **Root Directory**: `backend`
   - **Environment / Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 8000`
5. Click **Advanced** and add the following Environment Variables (matching your local `.env` setup):
   - `SUPABASE_URL`: Your Supabase Project URL.
   - `SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - `SUPABASE_SERVICE_KEY`: Your Supabase Secret Service Key.
   - `MODEL_PATH`: `/opt/render/project/src/models/best_resnet.pth`
   - `CLASSES_PATH`: `/opt/render/project/src/models/classes.json`
   - `FRONTEND_URL`: Your Vercel frontend URL (you can update this after Step 6).
6. Click **Create Web Service**. Wait 5-10 minutes for build logs to show success.
7. Copy your Web Service URL (e.g., `https://breedify-backend.onrender.com`).

---

## PART 2: DEPLOY FRONTEND TO VERCEL

### Step 5: Update config.js in Frontend
1. Open `frontend/js/config.js`.
2. Change the `API_BASE_URL` value to point to your new Render backend URL:
   ```javascript
   const CONFIG = {
       API_BASE_URL: "https://breedify-backend.onrender.com",
       // ... Supabase config
   };
   ```
3. Commit and push this change to your repository:
   ```bash
   git add frontend/js/config.js
   git commit -m "Update API endpoint to Render production URL"
   git push origin main
   ```

### Step 6: Deploy to Vercel
1. Log in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **New Project** and import the `breedify` repository.
3. Configure project options:
   - **Root Directory**: Select `frontend`
   - **Framework Preset**: Select `Other` (static HTML)
4. Click **Deploy**. Vercel will build the frontend and serve it.
5. Copy your live Vercel URL (e.g., `https://breedify.vercel.app`).

---

## PART 3: UPDATE AUTHENTICATION SETTINGS AFTER DEPLOYMENT

### Step 7: Update Google Cloud Console
1. Open the [Google Cloud Console](https://console.cloud.google.com).
2. Go to **APIs & Services** → **Credentials**.
3. Edit your OAuth 2.0 Client ID.
4. Add your production Vercel URL to **Authorized JavaScript origins**:
   - `https://breedify.vercel.app`
5. Save changes.

### Step 8: Update Supabase Redirect Settings
1. Go to your Supabase Dashboard.
2. Navigate to **Authentication** → **URL Configuration**.
3. Update the **Site URL** to:
   - `https://breedify.vercel.app`
4. Add your OAuth callback page under **Redirect URLs**:
   - `https://breedify.vercel.app/auth-callback.html`
5. Click **Save**.

### Step 9: Update Backend Environment Variables on Render
1. Open your Render Web Service dashboard, and click **Environment**.
2. Update the `FRONTEND_URL` environment variable to point to your production Vercel URL:
   - `FRONTEND_URL` → `https://breedify.vercel.app`
3. Save changes. Render will automatically trigger a redeploy with the updated config.

### Step 10: Final Verification
Go to your live Vercel website, and verify that login, registration, Google integration, and cattle breed camera/upload identification work correctly on HTTPS.
