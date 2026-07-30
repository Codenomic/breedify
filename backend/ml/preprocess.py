# PURPOSE: Convert any image input (file bytes, URL) into a normalized tensor

from PIL import Image
from torchvision import transforms
import httpx
import io

# This EXACT transform pipeline must be used — matches ImageNet training standard
# which ResNet was trained on:
TRANSFORM = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def preprocess_bytes(image_bytes: bytes):
    """
    Takes raw image bytes (from upload or camera capture).
    1. Open with PIL: Image.open(io.BytesIO(image_bytes))
    2. Convert to RGB (handles PNG, JPEG, WEBP etc): image.convert("RGB")
    3. Apply TRANSFORM
    4. Return tensor
    """
    image = Image.open(io.BytesIO(image_bytes))
    image = image.convert("RGB")
    return TRANSFORM(image)

def preprocess_url(url: str):
    """
    Downloads image from a public URL and preprocesses it.
    1. Use httpx.get(url, timeout=10) to download
    2. Check response status — if not 200, raise ValueError("Could not download image")
    3. Pass response.content to preprocess_bytes()
    4. Return tensor
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    try:
        response = httpx.get(url, headers=headers, follow_redirects=True, timeout=10)
    except Exception as e:
        raise ValueError(f"Could not download image from the provided URL: {str(e)}")
    
    if response.status_code != 200:
        raise ValueError("Could not download image from the provided URL")
    
    return preprocess_bytes(response.content)
