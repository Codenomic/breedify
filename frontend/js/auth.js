// PURPOSE: Handle Google OAuth, Email login/signup, token storage, logout
// This file integrates with the existing login.html form

document.addEventListener("DOMContentLoaded", () => {
    // Check current page
    const path = window.location.pathname;
    const isLoginPage = path.includes("login.html") || path.endsWith("/login");
    
    if (isLoginPage) {
        // Redirect if already logged in
        if (isLoggedIn()) {
            window.location.href = "index.html";
            return;
        }

        // Attach Google login listener
        const googleBtn = document.getElementById("google-login-btn") || 
                           document.querySelector(".google-btn") || 
                           Array.from(document.querySelectorAll("button")).find(btn => btn.textContent.toLowerCase().includes("google"));
                           
        if (googleBtn) {
            googleBtn.addEventListener("click", (e) => {
                e.preventDefault();
                googleLogin();
            });
        }

        // Find forms
        const forms = document.querySelectorAll("form");
        let signInForm = null;
        let signUpForm = null;
        
        forms.forEach(form => {
            const hasNameInput = form.querySelector("input[name='name']") || 
                                 form.querySelector("input[placeholder*='name']") || 
                                 form.querySelector("input[placeholder*='Name']") || 
                                 form.querySelector("#name") ||
                                 form.querySelector("input[type='tel']");
            if (hasNameInput) {
                signUpForm = form;
            } else {
                signInForm = form;
            }
        });
        
        // Fallback checks
        if (forms.length === 1) {
            signInForm = forms[0];
        }
        
        if (signInForm) {
            signInForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const emailInput = signInForm.querySelector("input[type='email']") || signInForm.querySelector("#email");
                const passwordInput = signInForm.querySelector("input[type='password']") || signInForm.querySelector("#password");
                
                if (emailInput && passwordInput) {
                    await emailLogin(emailInput.value, passwordInput.value, signInForm);
                }
            });
        }
        
        if (signUpForm) {
            signUpForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const nameInput = signUpForm.querySelector("input[name='name']") || 
                                  signUpForm.querySelector("input[placeholder*='name']") || 
                                  signUpForm.querySelector("input[placeholder*='Name']") || 
                                  signUpForm.querySelector("#name");
                const emailInput = signUpForm.querySelector("input[type='email']") || signUpForm.querySelector("#email");
                const passwordInput = signUpForm.querySelector("input[type='password']") || signUpForm.querySelector("#password");
                const confirmInput = signUpForm.querySelector("input[placeholder*='Confirm']") || 
                                     signUpForm.querySelector("input[placeholder*='confirm']") || 
                                     signUpForm.querySelectorAll("input[type='password']")[1];
                
                if (emailInput && passwordInput) {
                    if (confirmInput && passwordInput.value !== confirmInput.value) {
                        showError("Passwords do not match", signUpForm);
                        return;
                    }
                    if (passwordInput.value.length < 6) {
                        showError("Password must be at least 6 characters", signUpForm);
                        return;
                    }
                    const name = nameInput ? nameInput.value : "";
                    await emailSignup(emailInput.value, passwordInput.value, name, signUpForm);
                }
            });
        }
    }

    // Shared execution on page load
    runGlobalAuthChecks();
});

// Google Login redirection
function googleLogin() {
    window.location.href = `${CONFIG.API_BASE_URL}/auth/google`;
}

// Email Login
async function emailLogin(email, password, formElement) {
    showError("", formElement);
    setLoadingState(true, formElement);
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
            localStorage.setItem("breedify_token", data.access_token);
            localStorage.setItem("breedify_user", JSON.stringify(data.user));
            window.location.href = "index.html";
        } else {
            showError(data.detail || "Invalid email or password", formElement);
        }
    } catch (err) {
        showError("Failed to connect to backend server.", formElement);
    } finally {
        setLoadingState(false, formElement);
    }
}

// Email Signup
async function emailSignup(email, password, name, formElement) {
    showError("", formElement);
    setLoadingState(true, formElement);
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, name })
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
            showSuccess(data.message || "Check your email to confirm signup", formElement);
        } else {
            showError(data.detail || "Signup failed. Please try again.", formElement);
        }
    } catch (err) {
        showError("Failed to connect to backend server.", formElement);
    } finally {
        setLoadingState(false, formElement);
    }
}

// Session checking
function isLoggedIn() {
    return localStorage.getItem("breedify_token") !== null;
}

// Get user profile object
function getUser() {
    try {
        return JSON.parse(localStorage.getItem("breedify_user"));
    } catch (e) {
        return null;
    }
}

// Logout
async function logout() {
    const token = localStorage.getItem("breedify_token");
    if (token) {
        try {
            await fetch(`${CONFIG.API_BASE_URL}/auth/logout?access_token=${encodeURIComponent(token)}`, {
                method: "POST"
            });
        } catch (e) {
            console.error("Logout endpoint request error:", e);
        }
    }
    localStorage.removeItem("breedify_token");
    localStorage.removeItem("breedify_user");
    window.location.href = "login.html";
}

// Helper: button states
function setLoadingState(loading, form) {
    if (!form) return;
    const btn = form.querySelector("button[type='submit']");
    if (btn) {
        if (loading) {
            btn.disabled = true;
            btn.dataset.originalText = btn.textContent;
            btn.textContent = "Processing...";
        } else {
            btn.disabled = false;
            if (btn.dataset.originalText) {
                btn.textContent = btn.dataset.originalText;
            }
        }
    }
}

// Helper: display errors
function showError(message, form) {
    if (!form) return;
    let errEl = form.querySelector(".error-message") || form.querySelector("#error-msg");
    if (!errEl && message) {
        errEl = document.createElement("div");
        errEl.className = "error-message";
        errEl.style.color = "#ef4444";
        errEl.style.marginTop = "10.5px";
        errEl.style.fontSize = "14px";
        errEl.style.fontWeight = "500";
        form.appendChild(errEl);
    }
    if (errEl) {
        errEl.textContent = message;
    }
}

// Helper: display success
function showSuccess(message, form) {
    if (!form) return;
    let succEl = form.querySelector(".success-message") || form.querySelector("#success-msg");
    if (!succEl && message) {
        succEl = document.createElement("div");
        succEl.className = "success-message";
        succEl.style.color = "#10b981";
        succEl.style.marginTop = "10.5px";
        succEl.style.fontSize = "14px";
        succEl.style.fontWeight = "500";
        form.appendChild(succEl);
    }
    if (succEl) {
        succEl.textContent = message;
    }
}

// Route guard validation
function runGlobalAuthChecks() {
    const path = window.location.pathname;
    
    // Profile protection
    if (path.includes("profile.html") && !isLoggedIn()) {
        window.location.href = "login.html";
        return;
    }
    
    // Sign-in page bypass
    if ((path.includes("login.html") || path.endsWith("/login")) && isLoggedIn()) {
        window.location.href = "index.html";
        return;
    }
    
    updateNavbar();
}

// Update navbar element based on state
function updateNavbar() {
    const user = getUser();
    const navRight = document.querySelector(".nav-right") || 
                     document.querySelector("nav .flex:last-child") || 
                     document.getElementById("nav-auth-section");
    
    if (!navRight) return;
    
    if (isLoggedIn() && user) {
        // User logged in: replace Auth buttons with username/avatar & logout
        navRight.innerHTML = `
            <div class="flex items-center gap-4" style="display: flex; align-items: center; gap: 16px;">
                <span class="text-heading font-medium" style="font-weight: 500; font-family: 'Outfit', sans-serif;">${user.name || user.email}</span>
                <button onclick="logout()" class="btn-logout" style="cursor: pointer; background: transparent; border: 1px solid rgba(255,255,255,0.15); padding: 8px 16px; border-radius: 10px; font-family: 'Outfit', sans-serif; font-weight: 500; font-size: 14px; transition: all 0.2s;">Logout</button>
            </div>
        `;
    }
}
