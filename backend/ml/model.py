# PURPOSE: Load best_resnet.pth once and run inference efficiently

import torch
import torchvision.models as models
import torch.nn as nn
import json
import os
from config import MODEL_PATH, CLASSES_PATH

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_model():
    """
    Load the ResNet model from best_resnet.pth.
    
    IMPORTANT LOGIC:
    1. First, load classes.json to get number of classes (26)
    2. Try loading as ResNet50 first (most common)
    3. If it fails due to layer mismatch, try ResNet34, then ResNet18
    4. Replace the final fully connected layer: model.fc = nn.Linear(in_features, num_classes)
       where num_classes = 26 (length of classes.json)
    5. Load state dict with: model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
       Note: Set weights=None when calling resnet functions to avoid downloading pretrained weights.
    6. Set model to eval mode: model.eval()
    7. Move to device
    8. Return model
    
    ERROR HANDLING:
    - If model file not found → raise FileNotFoundError with clear message
    - If architecture mismatch → print which architecture worked
    - Print "✅ Model loaded successfully on {device}" when done
    """
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")
        
    if not os.path.exists(CLASSES_PATH):
        raise FileNotFoundError(f"Classes file not found at: {CLASSES_PATH}")
        
    try:
        with open(CLASSES_PATH, "r", encoding="utf-8") as f:
            class_names = json.load(f)
        num_classes = len(class_names)
    except Exception as e:
        raise ValueError(f"Failed to read classes.json: {e}")

    architectures = [
        ("ResNet50", models.resnet50),
        ("ResNet34", models.resnet34),
        ("ResNet18", models.resnet18)
    ]
    
    model = None
    last_err = None
    loaded_arch = None
    
    for name, resnet_loader in architectures:
        try:
            # Instantiate structure
            curr_model = resnet_loader(weights=None)
            
            # Replace final fully connected layer
            in_features = curr_model.fc.in_features
            curr_model.fc = nn.Linear(in_features, num_classes)
            
            # Load state dict
            state_dict = torch.load(MODEL_PATH, map_location=device)
            curr_model.load_state_dict(state_dict)
            
            model = curr_model
            loaded_arch = name
            print(f"Architecture worked: {name}")
            break
        except Exception as e:
            last_err = e
            continue
            
    if model is None:
        raise RuntimeError(
            f"Failed to load ResNet model from {MODEL_PATH}. Tried ResNet50, ResNet34, and ResNet18. "
            f"Last error: {last_err}"
        )
        
    model.eval()
    try:
        print(f"✅ Model loaded successfully on {device}")
    except UnicodeEncodeError:
        print(f"Model loaded successfully on {device}")
    return model

def predict(model, image_tensor, class_names, top_k=3):
    """
    Run inference on a preprocessed image tensor.
    
    Steps:
    1. Add batch dimension: image_tensor.unsqueeze(0)
    2. Move tensor to device
    3. Run model with torch.no_grad()
    4. Apply softmax to get probabilities
    5. Get top_k predictions with torch.topk()
    6. Return list of dicts: [{"breed": "Murrah", "confidence": 97.4}, ...]
    7. Confidence must be rounded to 1 decimal place
    8. The first item in the list is the top prediction
    """
    # 1. Add batch dimension
    input_tensor = image_tensor.unsqueeze(0)
    # 2. Move to device
    input_tensor = input_tensor.to(device)
    # 3. Run model with no grad
    with torch.no_grad():
        outputs = model(input_tensor)
        # 4. Softmax
        probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
        
    # 5. Get top_k
    top_prob, top_indices = torch.topk(probabilities, top_k)
    
    # 6. Format results
    results = []
    for i in range(top_k):
        idx = top_indices[i].item()
        prob = top_prob[i].item() * 100
        results.append({
            "breed": class_names[idx],
            "confidence": round(prob, 1)
        })
        
    return results
