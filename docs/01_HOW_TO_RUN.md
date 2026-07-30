# How to Run Breedify Locally

This guide explains how to get the Breedify backend and frontend running on your local machine.

## Prerequisites

- **Python**: Version 3.10 or 3.11 installed.
- **Git**: Installed on your system.
- **Code Editor**: VS Code (recommended).
- **Required Files**:
  - `best_resnet.pth` (PyTorch model weights)
  - `classes.json` (List of 26 breed names)

---

## Step-by-Step Setup

### Step 1: Clone or Download the Project
Make sure the Breedify files are placed in a workspace folder. The final structure should look like this:
```
breedify/
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── ...
├── models/
│   ├── best_resnet.pth
│   └── classes.json
└── frontend/
```

### Step 2: Set Up the Backend
1. Open your terminal.
2. Navigate to the backend directory:
   ```bash
   cd breedify/backend
   ```
3. Create a python virtual environment:
   ```bash
   python -m venv venv
   ```
4. Activate the virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     venv\Scripts\activate
     ```
   - **Mac/Linux**:
     ```bash
     source venv/bin/activate
     ```
5. Install packages:
   ```bash
   pip install -r requirements.txt
   ```
6. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
7. Open `.env` and fill in your actual Supabase credentials and URLs (see `docs/03_SUPABASE_SETUP.md`).

### Step 3: Run the Backend
Start the FastAPI local development server:
```bash
uvicorn main:app --reload --port 8000
```
**Expected Console Output:**
```
✅ Model loaded successfully on cpu (Architecture worked: ResNet50)
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

### Step 4: Run the Frontend
You can serve the static frontend folder:
- **Option A (Recommended)**: Use the **VS Code Live Server** extension. Open `frontend/index.html` in VS Code, right-click, and select **Open with Live Server**. (It typically serves on `http://localhost:5500`).
- **Option B**: Open `frontend/index.html` directly in your browser.

### Step 5: Test
1. Visit `http://localhost:5500` (or the URL supplied by Live Server).
2. Go to the **Identify** page.
3. Upload a cattle photo (or supply a public URL / use the camera).
4. Verify the identification completes and shows the result in under 3 seconds.

---

## Common Errors and Fixes

- **"Model file not found"**:
  Make sure `best_resnet.pth` and `classes.json` are placed inside the `models/` directory at the project root.
- **"CORS error"**:
  Verify the FastAPI backend is running on port 8000 and the origins matches your frontend.
- **"Module not found"**:
  Ensure your virtual environment is activated before running the server or installing dependencies.
