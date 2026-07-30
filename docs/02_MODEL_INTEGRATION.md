# How the ML Model Works in Breedify

This document details the ML integration pipeline, from model loading and preprocessing to predictions.

## Used Files

- **`models/best_resnet.pth`**: Trained PyTorch ResNet model weights containing parameters for identifying 26 distinct breeds.
- **`models/classes.json`**: List of 26 breed names in the exact index order matching the final classification layer output.

---

## Loading Mechanism

The model loads **exactly once** when the FastAPI server initializes:
- Initial startup might take ~5–10 seconds depending on hardware, as weights are read into memory and mapped to the target CPU/GPU.
- Subsequent inference requests execute rapidly (under 3 seconds on standard CPUs) because the model parameters are stored persistently in memory.

### Dynamic Architecture Loader
The model loader (`backend/ml/model.py`) tries architectures sequentially to verify weights compatibility:
1. **ResNet50** (Standard deep architecture)
2. **ResNet34** (Medium architecture)
3. **ResNet18** (Lightweight architecture)

The final fully connected classification layer is dynamically replaced:
```python
model.fc = nn.Linear(in_features, num_classes) # num_classes = 26
```
Once the correct structure is mapped, it is set to evaluation mode (`model.eval()`) and pushed to the best available device (CUDA or CPU).

---

## Inference Pipeline

When a client submits an image (file or URL):
1. **Normalization**: The image is preprocessed (Resize to 256x256, CenterCrop to 224x224, Convert to Tensor, and Normalize with ImageNet mean `[0.485, 0.456, 0.406]` and standard deviation `[0.229, 0.224, 0.225]`).
2. **Forward Pass**: The normalized tensor is passed to the network within a `torch.no_grad()` block to bypass gradient calculations and save resources.
3. **Softmax Output**: Raw logits are mapped using Softmax to produce probabilities ranging from 0 to 100%.
4. **Top Predictions**: `torch.topk` filters out the top 3 breeds. Results are returned as a JSON structure, rounding confidence to 1 decimal place.

---

## How to Verify Your Model

1. Start your local server: `uvicorn main:app --reload`
2. Open your web browser and navigate to `http://localhost:8000/docs` (Swagger UI).
3. Try the `POST /api/identify` endpoint:
   - Upload a sample cattle image file.
   - Click execute.
4. Verify you receive a JSON response with:
   - `"success": true`
   - `"top_breed"` containing the identified breed.
   - `"confidence"` (percentage float).
   - `"alternatives"` list with 2 elements.

## Modifying Model Architectures
If you train a new model using a different architecture, you can adjust the list of architectures in `backend/ml/model.py`. The number of outputs (26) is automatically updated by querying `classes.json`.
