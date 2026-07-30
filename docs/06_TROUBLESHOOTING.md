# Troubleshooting Guide

This document lists common issues encountered during the Breedify setup, execution, or deployment, and offers guidelines for resolving them.

---

## Model Errors

### ERROR: "Model file not found"
- **Cause**: The model loader cannot find the `best_resnet.pth` weights file at the specified path.
- **Fix**: Check that `best_resnet.pth` exists inside the `models/` directory at the project root. Verify that `MODEL_PATH` in your `.env` matches the location of the file.

### ERROR: "CUDA out of memory"
- **Cause**: GPU resource limitations when running on high-load servers.
- **Fix**: The backend automatically falls back to CPU if CUDA is unavailable or errors. If you explicitly force CUDA, reduce image resolution or process input tensors in evaluation mode with `torch.no_grad()`.

### ERROR: "Prediction is wrong breed"
- **Cause**: Mismatch between the classes array and the neural network output classes.
- **Fix**: Verify that the elements inside `models/classes.json` are arranged in the exact order the model was trained on. A single misplaced breed name will shift predictions.

---

## API & Network Errors

### ERROR: "CORS policy blocked"
- **Cause**: The client frontend domain is not registered in the backend CORS whitelist.
- **Fix**: Verify the backend is running. Check `FRONTEND_URL` in the backend `.env` matches the frontend's origin URL (e.g. `http://localhost:5500` or production Vercel domain).

### ERROR: "Image URL identification fails"
- **Cause**: The URL is inaccessible, returns non-image content, or times out.
- **Fix**: Ensure the image URL is public (test by opening the image link inside an Incognito tab). The image must be standard formats: JPG, PNG, or WEBP.

---

## Authentication & Supabase Errors

### ERROR: "Google login redirects to error page"
- **Cause**: Redirect URIs mismatch between Google Cloud Console and Supabase.
- **Fix**: Double check that the OAuth redirect URI configured in your Google Developer credentials exactly matches the redirect URL from your Supabase Google Auth panel. Verify that no trailing slashes or formatting errors are present.

### ERROR: "Supabase RLS policy error"
- **Cause**: Database access is denied because Row Level Security policies are missing or violated.
- **Fix**: Verify you ran the complete SQL schema in your Supabase SQL Editor, specifically the `CREATE POLICY` queries for `profiles` and `identifications` tables.

---

## Camera Errors

### ERROR: "Camera not working on mobile"
- **Cause**: Security browsers block access to WebRTC camera feeds on HTTP connections.
- **Fix**: Modern mobile browsers require secure HTTPS connections to run media streams. Localhost is whitelisted, but production builds require HTTPS. Deploying the frontend to Vercel provides HTTPS automatically, which resolves mobile camera issues.

---

## Deployment & Hosting

### ERROR: "Render deployment times out"
- **Cause**: Render Free Web Services sleep after 15 minutes of inactivity.
- **Fix**: The initial request after a service sleeps will trigger a "cold start" taking 30–50 seconds to spin up and load the PyTorch model. This is standard free tier behavior. Upgrading to a paid web service prevents cold starts.
