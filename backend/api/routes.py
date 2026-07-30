# PURPOSE: Single endpoint that accepts image via file upload OR URL
# and returns breed prediction from the ML model

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import main as app_state  # Access the globally loaded model and class_names
from ml.model import predict
from ml.preprocess import preprocess_bytes, preprocess_url

router = APIRouter()

@router.post("/identify")
async def identify(
    file: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None)
):
    """
    LOGIC:
    1. Check that either file or image_url is provided. If neither → 400 error.
    2. If file is provided:
       a. Read bytes: image_bytes = await file.read()
       b. Validate it's an image (check content_type starts with "image/")
       c. Run preprocess_bytes(image_bytes)
    3. If image_url is provided:
       a. Run preprocess_url(image_url) — this downloads and preprocesses
    4. Call predict(app_state.model, tensor, app_state.class_names, top_k=3)
    5. Return JSON:
    {
        "success": true,
        "top_breed": "Murrah",
        "confidence": 97.4,
        "alternatives": [
            {"breed": "Surti", "confidence": 1.8},
            {"breed": "Nili-Ravi", "confidence": 0.8}
        ]
    }
    6. Wrap everything in try/except → return 500 with error message if anything fails
    7. Response time must be under 3 seconds on CPU
    
    ERROR RESPONSES:
    - No input provided → 400: "Please upload an image file or provide an image URL"
    - Invalid file type → 400: "File must be an image (jpg, png, webp)"
    - URL download failed → 400: "Could not download image from the provided URL"
    - Model error → 500: "Identification failed. Please try again."
    """
    try:
        # 1. Check that either file or image_url is provided
        if not file and not image_url:
            raise HTTPException(
                status_code=400,
                detail="Please upload an image file or provide an image URL"
            )
            
        tensor = None
        
        # 2. File uploaded
        if file:
            if not file.content_type or not file.content_type.startswith("image/"):
                raise HTTPException(
                    status_code=400,
                    detail="File must be an image (jpg, png, webp)"
                )
            try:
                image_bytes = await file.read()
                tensor = preprocess_bytes(image_bytes)
            except Exception as e:
                print(f"Error processing file bytes: {e}")
                raise HTTPException(
                    status_code=400,
                    detail="File must be an image (jpg, png, webp)"
                )
                
        # 3. URL provided
        elif image_url:
            try:
                tensor = preprocess_url(image_url)
            except Exception as e:
                print(f"Error downloading or processing image URL: {e}")
                raise HTTPException(
                    status_code=400,
                    detail="Could not download image from the provided URL"
                )
                
        if tensor is None:
            raise HTTPException(
                status_code=400,
                detail="Please upload an image file or provide an image URL"
            )
            
        # Verify model loading
        if app_state.model is None or not app_state.class_names:
            print("Model or class names not loaded on app_state")
            raise HTTPException(
                status_code=500,
                detail="Identification failed. Please try again."
            )
            
        # 4. Predict
        predictions = predict(app_state.model, tensor, app_state.class_names, top_k=3)
        print(f"Prediction results: {predictions}")
        
        # 5. Return JSON
        return {
            "success": True,
            "top_breed": predictions[0]["breed"],
            "confidence": predictions[0]["confidence"],
            "alternatives": predictions[1:]
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Unexpected prediction exception: {e}")
        raise HTTPException(
            status_code=500,
            detail="Identification failed. Please try again."
        )
