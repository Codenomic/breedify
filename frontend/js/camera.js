// PURPOSE: Handle camera capture and file upload on identify.html
// Integrates with existing identify page HTML elements

let activeStream = null;
let currentFacingMode = "environment";

document.addEventListener("DOMContentLoaded", () => {
    // Check if we are on identify.html
    const path = window.location.pathname;
    const isIdentifyPage = path.includes("identify.html") || path.endsWith("/identify");
    
    if (!isIdentifyPage) return;
    
    // Find key elements
    const fileInput = document.querySelector("input[type='file']:not([capture])") || document.getElementById("file-input");
    const cameraInput = document.querySelector("input[type='file'][capture]") || document.getElementById("camera-input");
    const dropZone = document.querySelector(".relative.cursor-pointer") || document.getElementById("drop-zone");
    const urlInput = document.querySelector("input[placeholder*='example.com']") || document.getElementById("url-input");
    
    // Locate Take Photo button
    const cameraBtn = Array.from(document.querySelectorAll("button")).find(btn => btn.textContent.toLowerCase().includes("photo") || btn.id === "camera-btn");
    
    // Locate Gallery/Upload button
    const galleryBtn = Array.from(document.querySelectorAll("button")).find(btn => btn.textContent.toLowerCase().includes("gallery") || btn.id === "gallery-btn");
    
    // Locate paste URL load button
    const loadUrlBtn = Array.from(document.querySelectorAll("button")).find(btn => btn.textContent.toLowerCase().includes("load") || btn.id === "load-url-btn");

    // File input change
    if (fileInput) {
        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                handleFileSelect(file);
            }
        });
    }

    // Capture input change (fallback native camera capture)
    if (cameraInput) {
        cameraInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                handleFileSelect(file);
            }
        });
    }

    // Take Photo button click (in-app WebRTC camera implementation)
    if (cameraBtn) {
        cameraBtn.addEventListener("click", (e) => {
            e.preventDefault();
            startInAppCamera();
        });
    }

    // Gallery button trigger
    if (galleryBtn && fileInput) {
        galleryBtn.addEventListener("click", (e) => {
            e.preventDefault();
            fileInput.click();
        });
    }

    // Drag and drop events
    if (dropZone) {
        dropZone.addEventListener("click", (e) => {
            if (e.target !== fileInput && e.target !== cameraInput && !activeStream) {
                fileInput.click();
            }
        });
        
        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZone.classList.add("border-primary", "bg-primary/5", "scale-[1.01]");
        });
        
        dropZone.addEventListener("dragleave", () => {
            dropZone.classList.remove("border-primary", "bg-primary/5", "scale-[1.01]");
        });
        
        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropZone.classList.remove("border-primary", "bg-primary/5", "scale-[1.01]");
            const file = e.dataTransfer.files[0];
            if (file) {
                handleFileSelect(file);
            }
        });
    }

    // URL paste verification
    if (loadUrlBtn && urlInput) {
        loadUrlBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const url = urlInput.value.trim();
            if (url) {
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    showPreviewState(url, "Image from URL");
                    setupIdentifyBtn(() => identifyImage(url, "url"));
                } else {
                    showFriendlyError("Please enter a valid image URL starting with http:// or https://");
                }
            }
        });
    }
});

// File processing / validation
function handleFileSelect(file) {
    if (!file.type.startsWith("image/")) {
        showFriendlyError("File must be an image (jpg, png, webp)");
        return;
    }
    
    // Read and show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        showPreviewState(e.target.result, file.name);
        setupIdentifyBtn(() => identifyImage(file, "upload"));
    };
    reader.readAsDataURL(file);
}

// In-app Camera WebRTC Stream
async function startInAppCamera() {
    const dropZone = document.querySelector(".relative.cursor-pointer") || document.getElementById("drop-zone");
    if (!dropZone) return;
    
    // Stop any existing stream
    stopActiveCamera();
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: currentFacingMode } 
        });
        
        activeStream = stream;
        
        // Hide upload content, create video preview
        dropZone.innerHTML = "";
        dropZone.style.padding = "0";
        dropZone.style.position = "relative";
        
        const video = document.createElement("video");
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true;
        video.style.width = "100%";
        video.style.maxHeight = "400px";
        video.style.objectFit = "cover";
        video.style.borderRadius = "16px";
        
        // Control overlay
        const controls = document.createElement("div");
        controls.style.position = "absolute";
        controls.style.bottom = "20px";
        controls.style.left = "50%";
        controls.style.transform = "translateX(-50%)";
        controls.style.display = "flex";
        controls.style.gap = "12px";
        controls.style.zIndex = "10";
        
        // Capture button
        const captureBtn = document.createElement("button");
        captureBtn.className = "h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg hover:brightness-110";
        captureBtn.textContent = "Capture Photo";
        captureBtn.style.cursor = "pointer";
        captureBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            capturePhoto(video, stream);
        });
        
        // Flip Camera Button (mobile support)
        const flipBtn = document.createElement("button");
        flipBtn.className = "h-12 w-12 rounded-xl bg-secondary text-heading shadow-lg hover:bg-secondary/80 flex items-center justify-center";
        flipBtn.innerHTML = `⚙️`; // Simple gear as icon fallback
        flipBtn.style.cursor = "pointer";
        flipBtn.title = "Flip Camera";
        flipBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentFacingMode = currentFacingMode === "environment" ? "user" : "environment";
            startInAppCamera();
        });
        
        // Cancel/Close Button
        const cancelBtn = document.createElement("button");
        cancelBtn.className = "h-12 w-12 rounded-xl bg-secondary text-heading shadow-lg hover:bg-secondary/80 flex items-center justify-center";
        cancelBtn.innerHTML = `✕`;
        cancelBtn.style.cursor = "pointer";
        cancelBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            stopActiveCamera();
            resetIdentifyPage();
        });
        
        controls.appendChild(captureBtn);
        controls.appendChild(flipBtn);
        controls.appendChild(cancelBtn);
        
        dropZone.appendChild(video);
        dropZone.appendChild(controls);
        
    } catch (err) {
        console.error("Camera error:", err);
        showFriendlyError("Camera access denied. Please use file upload instead.");
    }
}

// Stop current stream
function stopActiveCamera() {
    if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
        activeStream = null;
    }
}

// Capture frame and convert to Blob
function capturePhoto(video, stream) {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
        stopActiveCamera();
        
        // Convert Blob to data URL for preview
        const reader = new FileReader();
        reader.onload = (e) => {
            showPreviewState(e.target.result, "Captured Image");
            setupIdentifyBtn(() => identifyImage(blob, "capture"));
        };
        reader.readAsDataURL(blob);
    }, "image/jpeg", 0.92);
}

// Show Preview Interface
function showPreviewState(imageSrc, filename) {
    const dropZone = document.querySelector(".relative.cursor-pointer") || document.getElementById("drop-zone");
    if (!dropZone) return;
    
    dropZone.innerHTML = `
        <div class="relative rounded-2xl overflow-hidden border border-border bg-card" style="position: relative;">
            <img src="${imageSrc}" alt="Preview" class="w-full max-h-[400px] object-contain bg-bg-surface" style="width: 100%; max-height: 400px; object-fit: contain;" />
            <button id="cancel-preview-btn" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors" style="position: absolute; top: 12px; right: 12px; cursor: pointer; border: none; border-radius: 50%; width: 32px; height: 32px; background: rgba(0,0,0,0.6); color: white;">✕</button>
        </div>
        <div class="flex items-center justify-between mt-4" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px;">
            <p class="text-body text-sm truncate max-w-[60%]">${filename}</p>
            <div class="flex gap-3" style="display: flex; gap: 12px;">
                <button id="change-image-btn" class="h-10 px-4 rounded-xl border border-border hover:bg-secondary font-medium" style="cursor: pointer; background: transparent;">Change</button>
                <button id="confirm-identify-btn" class="h-10 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:brightness-110" style="cursor: pointer;">Identify Breed</button>
            </div>
        </div>
    `;
    
    // Add cancel listeners
    document.getElementById("cancel-preview-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        resetIdentifyPage();
    });
    document.getElementById("change-image-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        resetIdentifyPage();
    });
}

function setupIdentifyBtn(callback) {
    const btn = document.getElementById("confirm-identify-btn");
    if (btn) {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            callback();
        });
    }
}

// Reset page to original state
function resetIdentifyPage() {
    window.location.reload();
}

// Show error messages
function showFriendlyError(message) {
    const mainContainer = document.querySelector(".max-w-\\[720px\\]") || document.querySelector("main") || document.body;
    let errBox = document.getElementById("friendly-error-box");
    if (!errBox) {
        errBox = document.createElement("div");
        errBox.id = "friendly-error-box";
        errBox.className = "rounded-2xl border border-destructive/50 bg-destructive/10 p-8 text-center space-y-4";
        errBox.style.margin = "20px 0";
        errBox.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
        errBox.style.border = "1px solid rgba(239, 68, 68, 0.5)";
        errBox.style.padding = "24px";
        errBox.style.borderRadius = "16px";
        errBox.style.textAlign = "center";
        
        const title = document.createElement("p");
        title.style.fontWeight = "600";
        title.style.color = "#ef4444";
        title.className = "text-heading";
        errBox.appendChild(title);
        
        const tryAgain = document.createElement("button");
        tryAgain.className = "mt-4 h-10 px-6 rounded-xl border border-border hover:bg-secondary font-medium";
        tryAgain.textContent = "Dismiss";
        tryAgain.style.cursor = "pointer";
        tryAgain.style.marginTop = "12px";
        tryAgain.addEventListener("click", () => errBox.remove());
        errBox.appendChild(tryAgain);
        
        mainContainer.insertBefore(errBox, mainContainer.firstChild);
    }
    
    errBox.querySelector("p").textContent = message;
}

// Core function: send data to backend
async function identifyImage(input, type) {
    showLoadingOverlay(true);
    
    const formData = new FormData();
    if (type === "url") {
        formData.append("image_url", input);
    } else {
        formData.append("file", input);
    }
    
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/identify`, {
            method: "POST",
            body: formData
        });
        
        const data = await response.json();
        showLoadingOverlay(false);
        
        if (response.ok && data.success) {
            saveIdentificationToHistory(data.top_breed, data.confidence, data.alternatives);
            renderIdentificationResults(data);
        } else {
            showFriendlyError(data.detail || "Identification failed. Please try again.");
        }
    } catch (err) {
        showLoadingOverlay(false);
        showFriendlyError("Failed to connect to the backend server. Make sure the backend service is running.");
    }
}

// Show/Hide Loading Overlay
function showLoadingOverlay(show) {
    let overlay = document.getElementById("identify-loading-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "identify-loading-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        overlay.style.backdropFilter = "blur(5px)";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = "9999";
        
        const spinner = document.createElement("div");
        spinner.style.border = "4px solid rgba(255,255,255,0.1)";
        spinner.style.borderTop = "4px solid #f97316";
        spinner.style.borderRadius = "50%";
        spinner.style.width = "50px";
        spinner.style.height = "50px";
        spinner.style.animation = "spin 1s linear infinite";
        
        const style = document.createElement("style");
        style.textContent = "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
        document.head.appendChild(style);
        
        const text = document.createElement("p");
        text.textContent = "Identifying breed...";
        text.style.color = "white";
        text.style.marginTop = "16px";
        text.style.fontFamily = "'Outfit', sans-serif";
        text.style.fontSize = "18px";
        text.style.fontWeight = "500";
        
        overlay.appendChild(spinner);
        overlay.appendChild(text);
        document.body.appendChild(overlay);
    }
    
    overlay.style.display = show ? "flex" : "none";
    
    const buttons = document.querySelectorAll("button");
    buttons.forEach(btn => {
        if (btn.id !== "friendly-error-box" && !btn.closest("#identify-loading-overlay")) {
            btn.disabled = show;
        }
    });
}

// Display results in existing result section
function renderIdentificationResults(data) {
    const mainContainer = document.querySelector(".max-w-\\[720px\\]") || document.querySelector("main") || document.body;
    
    let resultSection = document.getElementById("identification-results-section");
    if (!resultSection) {
        resultSection = document.createElement("div");
        resultSection.id = "identification-results-section";
        resultSection.className = "rounded-2xl border border-primary/30 bg-card p-10 space-y-6";
        resultSection.style.marginTop = "40px";
        resultSection.style.padding = "32px";
        resultSection.style.border = "1px solid rgba(249, 115, 22, 0.3)";
        resultSection.style.borderRadius = "16px";
        resultSection.style.fontFamily = "'Outfit', sans-serif";
        
        mainContainer.appendChild(resultSection);
    }
    
    let altHtml = "";
    if (data.alternatives && data.alternatives.length > 0) {
        altHtml = `
            <div style="margin-top: 20px;">
                <h4 style="font-weight: 600; font-size: 14px; text-transform: uppercase; color: #a1a1aa; margin-bottom: 12px; font-family: 'Outfit', sans-serif;">Alternative Breeds</h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${data.alternatives.map(alt => `
                        <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 10px 16px; border-radius: 10px;">
                            <span style="font-weight: 500;">${alt.breed}</span>
                            <span style="font-weight: 600; color: #f97316;">${alt.confidence}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    resultSection.innerHTML = `
        <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(249, 115, 22, 0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
                <span style="font-size: 28px; color: #f97316;">🐄</span>
            </div>
            <h2 style="font-size: 24px; font-weight: 700; color: var(--heading); margin-bottom: 8px;">Analysis Complete!</h2>
            <p style="color: var(--body); font-size: 14px;">AI-powered visual analysis results</p>
        </div>
        
        <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-weight: 500; font-size: 14px; text-transform: uppercase; color: #a1a1aa;">Identified Breed</span>
                <span style="font-weight: 700; font-size: 20px; color: #f97316;">${data.top_breed}</span>
            </div>
            
            <div style="margin-top: 8px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                    <span style="font-size: 13px; font-weight: 500;">AI Confidence</span>
                    <span style="font-size: 15px; font-weight: 600; color: #f97316;">${data.confidence}%</span>
                </div>
                <div style="height: 10px; width: 100%; background: rgba(255,255,255,0.08); border-radius: 5px; overflow: hidden;">
                    <div style="height: 100%; width: ${data.confidence}%; background: #f97316; border-radius: 5px; transition: width 0.5s ease-in-out;"></div>
                </div>
            </div>
        </div>
        
        ${altHtml}
        
        <div style="display: flex; justify-content: center; gap: 12px; margin-top: 24px;">
            <button onclick="window.location.reload()" class="h-10 px-6 rounded-xl border border-border hover:bg-secondary font-medium" style="cursor: pointer; background: transparent;">Identify Another</button>
            <button id="view-details-btn" class="h-10 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:brightness-110" style="cursor: pointer;">View Breed Profile</button>
        </div>
    `;
    
    document.getElementById("view-details-btn").addEventListener("click", () => {
        window.location.href = `breeds.html?search=${encodeURIComponent(data.top_breed)}`;
    });
    
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Optionally save searches to local storage history
function saveIdentificationToHistory(breedName, confidence, alternatives) {
    try {
        const historyKey = "breedify_history";
        const history = JSON.parse(localStorage.getItem(historyKey) || "[]");
        const newEntry = {
            id: typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substring(2),
            breedName: breedName,
            confidence: confidence,
            date: new Date().toISOString(),
            alternatives: alternatives
        };
        history.unshift(newEntry);
        localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 50)));
    } catch (e) {
        console.error("Failed to save history entry:", e);
    }
}
