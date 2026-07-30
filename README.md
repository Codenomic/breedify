# Breedify — AI-powered Cattle Breed Identification

Breedify is an AI-powered web application built to identify Indian cattle breeds from photos. The project integrates a FastAPI backend with a PyTorch ResNet model and uses Supabase for user authentication, Google OAuth login, and database history storage.

---

## 📁 Project Structure

```
breedify/
├── backend/                  # FastAPI Application Source
│   ├── api/                  # Core Identification Route
│   ├── auth/                 # Supabase Email & Google Login Router
│   ├── ml/                   # PyTorch Preprocessing & Inference Loader
│   ├── main.py               # Main Entrypoint
│   ├── config.py             # Settings Loader
│   └── requirements.txt      # Python Dependencies
│
├── frontend/                 # Static HTML/CSS/JS Assets
│   ├── js/
│   │   ├── config.js         # API Server URLs
│   │   ├── auth.js           # Client Auth & Route Guards
│   │   └── camera.js         # Camera, Upload, & API Submissions
│   └── auth-callback.html    # OAuth Sign-In Token Callback Handler
│
├── models/                   # Machine Learning Model & Classes
│   ├── best_resnet.pth       # Trained PyTorch ResNet model weights
│   └── classes.json          # list of 26 breed name classes
│
└── docs/                     # Detailed Setup Documentation
    ├── 01_HOW_TO_RUN.md      # How to install dependencies and run locally
    ├── 02_MODEL_INTEGRATION.md  # Deep dive into PyTorch models loading & inference
    ├── 03_SUPABASE_SETUP.md  # PostgreSQL schemas and triggers setup on Supabase
    ├── 04_GOOGLE_AUTH_SETUP.md # Google Cloud Console OAuth setup instructions
    ├── 05_DEPLOYMENT.md      # Production deployment guidelines (Render + Vercel)
    └── 06_TROUBLESHOOTING.md # Diagnostics for common model/connection errors
```

---

## 🚀 Quick Start (Local Run)

1. **Configure Models**: Ensure `best_resnet.pth` and `classes.json` are placed in the `models/` directory.
2. **Setup Backend Environment**:
   ```bash
   cd backend
   python -m venv venv
   # Activate virtualenv (e.g. venv\Scripts\activate on Windows)
   pip install -r requirements.txt
   cp .env.example .env
   # Add your Supabase keys in .env
   ```
3. **Launch Server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
4. **Launch Frontend**: Run `frontend/index.html` using the **VS Code Live Server** extension (on port `5500`).

---

## 📚 Technical Overview

- **Backend Architecture**: Built with **FastAPI** utilizing a lifespan manager to cache the PyTorch model once in memory on server launch, delivering sub-3-second responses.
- **Model Inference**: Integrates a **ResNet** architecture trained on 26 Indian cattle breeds, standardizing client images using torchvision's ImageNet normalization.
- **Authentication & Storage**: Leverages **Supabase Auth** for Email Signup/Login, Google OAuth flows, and PostgreSQL tables secured with Row Level Security (RLS) to store identification histories.

For comprehensive details on specific sub-systems, refer to the documentation files in the `docs/` folder.
