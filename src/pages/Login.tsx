import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirm, setSignUpConfirm] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    // Simulate auth — will be replaced with Lovable Cloud
    setTimeout(() => {
      setLoading(false);
      toast.success("Signed in successfully!");
      navigate("/profile");
    }, 1200);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword || !signUpConfirm) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (signUpPassword !== signUpConfirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (signUpPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Account created successfully!");
      navigate("/profile");
    }, 1200);
  };

  const handleGoogleSignIn = () => {
    toast("Google Sign-In will be available with Lovable Cloud", {
      description: "Coming soon with full authentication",
    });
  };

  return (
    <div className="min-h-screen bg-background animate-page-enter">
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border bg-card min-h-[560px]">
          {/* Left — Branding Panel */}
          <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-[hsl(var(--bg-surface))] to-[hsl(var(--background))] border-r border-border">
            <div>
              <h4 className="section-label text-[hsl(var(--text-muted))] mb-4">Welcome to</h4>
              <h1 className="font-tanker text-5xl text-[hsl(var(--text-heading))] mb-3 tracking-wide">
                Breed<span className="text-primary">ify</span>
              </h1>
              <p className="text-[hsl(var(--text-body))] text-base leading-relaxed max-w-xs">
                AI-powered cattle breed identification built for Indian farmers. Identify, learn, and make smarter decisions.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { num: "26+", label: "Indian Breeds" },
                { num: "AI", label: "Instant ID" },
                { num: "Free", label: "To Use" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <span className="text-primary font-bold text-lg font-outfit">{stat.num}</span>
                  <span className="text-[hsl(var(--text-muted))] text-sm font-tenor uppercase tracking-widest">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Decorative gradient blob */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Right — Form Panel */}
          <div className="flex flex-col p-8 md:p-10">
            {/* Tabs */}
            <div className="flex mb-8 bg-[hsl(var(--bg-hover))] rounded-xl p-1">
              {(["signin", "signup"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-sm font-outfit font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-body))]"
                  }`}
                >
                  {tab === "signin" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Google Button */}
            <Button
              variant="outline"
              className="w-full mb-6 h-11 gap-3 border-border hover:border-border-hover hover:bg-[hsl(var(--bg-hover))] text-[hsl(var(--text-heading))] rounded-xl"
              onClick={handleGoogleSignIn}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[hsl(var(--text-muted))] text-xs font-tenor uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Sign In Form */}
            {activeTab === "signin" && (
              <form onSubmit={handleSignIn} className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Label className="text-[hsl(var(--text-body))] text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-muted))]" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="pl-10 h-11 bg-[hsl(var(--bg-surface))] border-border rounded-xl text-[hsl(var(--text-heading))] placeholder:text-[hsl(var(--text-placeholder))]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[hsl(var(--text-body))] text-sm">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-muted))]" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 bg-[hsl(var(--bg-surface))] border-border rounded-xl text-[hsl(var(--text-heading))] placeholder:text-[hsl(var(--text-placeholder))]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-body))] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="button" className="text-primary text-sm hover:underline font-outfit">
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-outfit font-semibold text-sm gap-2 mt-2"
                >
                  {loading ? "Signing in..." : "Sign In"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </Button>

                <p className="text-center text-[hsl(var(--text-muted))] text-sm mt-4">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signup")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign Up
                  </button>
                </p>
              </form>
            )}

            {/* Sign Up Form */}
            {activeTab === "signup" && (
              <form onSubmit={handleSignUp} className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Label className="text-[hsl(var(--text-body))] text-sm">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-muted))]" />
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      className="pl-10 h-11 bg-[hsl(var(--bg-surface))] border-border rounded-xl text-[hsl(var(--text-heading))] placeholder:text-[hsl(var(--text-placeholder))]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[hsl(var(--text-body))] text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-muted))]" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="pl-10 h-11 bg-[hsl(var(--bg-surface))] border-border rounded-xl text-[hsl(var(--text-heading))] placeholder:text-[hsl(var(--text-placeholder))]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[hsl(var(--text-body))] text-sm">Phone (optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-muted))]" />
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      className="pl-10 h-11 bg-[hsl(var(--bg-surface))] border-border rounded-xl text-[hsl(var(--text-heading))] placeholder:text-[hsl(var(--text-placeholder))]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--text-body))] text-sm">Password</Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 chars"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="h-11 bg-[hsl(var(--bg-surface))] border-border rounded-xl text-[hsl(var(--text-heading))] placeholder:text-[hsl(var(--text-placeholder))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--text-body))] text-sm">Confirm</Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter"
                      value={signUpConfirm}
                      onChange={(e) => setSignUpConfirm(e.target.value)}
                      className="h-11 bg-[hsl(var(--bg-surface))] border-border rounded-xl text-[hsl(var(--text-heading))] placeholder:text-[hsl(var(--text-placeholder))]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-outfit font-semibold text-sm gap-2 mt-2"
                >
                  {loading ? "Creating account..." : "Create Account"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </Button>

                <p className="text-center text-[hsl(var(--text-muted))] text-sm mt-4">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signin")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
