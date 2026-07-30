# Load all environment variables from .env
# Variables needed:
# SUPABASE_URL         → Your Supabase project URL
# SUPABASE_ANON_KEY    → Supabase public anon key
# SUPABASE_SERVICE_KEY → Supabase service role key (admin access)
# MODEL_PATH           → Path to best_resnet.pth (default: ../models/best_resnet.pth)
# CLASSES_PATH         → Path to classes.json (default: ../models/classes.json)
# FRONTEND_URL         → http://localhost:5500 in dev, your Vercel URL in prod

from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
MODEL_PATH = os.getenv("MODEL_PATH", "../models/best_resnet.pth")
CLASSES_PATH = os.getenv("CLASSES_PATH", "../models/classes.json")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5500")
