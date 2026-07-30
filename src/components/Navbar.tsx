import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, Clock, Settings, LogOut } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Identify", path: "/identify" },
  { label: "Breeds", path: "/breeds" },
  { label: "History", path: "/history" },
];

const languages = [
  { code: "en", label: "EN", native: "English" },
  { code: "hi", label: "हि", native: "हिन्दी" },
  { code: "pa", label: "ਪੰ", native: "ਪੰਜਾਬੀ" },
  { code: "gu", label: "ગુ", native: "ગુજરાતી" },
  { code: "ta", label: "த", native: "தமிழ்" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("breedify_lang") || "en";
  });

  // Auth state from localStorage
  const [user, setUser] = useState<{ firstName: string; fullName: string; email: string; photo?: string } | null>(null);

  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = () => {
      const stored = localStorage.getItem("breedify_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Re-check auth on route change
  useEffect(() => {
    const stored = localStorage.getItem("breedify_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { setUser(null); }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAvatarOpen(false);
  }, [location.pathname]);

  // Close avatar dropdown on outside click or Escape
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAvatarOpen(false);
    };
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectLang = (code: string) => {
    setCurrentLang(code);
    localStorage.setItem("breedify_lang", code);
    setLangOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("breedify_user");
    setUser(null);
    setAvatarOpen(false);
    navigate("/");
  };

  const currentLangObj = languages.find((l) => l.code === currentLang) || languages[0];
  const isLoggedIn = !!user;
  const initials = user?.firstName?.charAt(0)?.toUpperCase() || "U";

  return (
    <nav
      className={`sticky top-0 z-[100] w-full h-16 px-4 md:px-8 flex items-center justify-between bg-surface transition-all duration-200 ${
        scrolled ? "backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.05)]" : ""
      }`}
    >
      {/* Logo */}
      <Link to="/" className="font-tanker text-heading text-2xl tracking-[0.04em] uppercase">
        Breedify
      </Link>

      {/* Center nav - desktop */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm font-outfit transition-colors duration-200 hover:text-primary ${
              location.pathname === link.path ? "text-heading font-bold" : "text-body"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right actions - desktop */}
      <div className="hidden md:flex items-center gap-3">
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="px-[18px] py-[9px] text-sm text-secondary-foreground border border-border rounded-md hover:border-primary hover:text-primary transition-all duration-200"
            >
              Log In
            </Link>
            <Link
              to="/login"
              className="px-5 py-[9px] text-sm font-semibold bg-primary text-primary-foreground border-[1.5px] border-primary rounded-md hover:brightness-95 hover:-translate-y-0.5 hover:shadow-[0_0_16px_rgba(196,255,51,0.3)] transition-all duration-200"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <div ref={avatarRef} className="relative">
            <button
              onClick={() => setAvatarOpen(!avatarOpen)}
              className={`flex items-center gap-2 py-1.5 pl-1.5 pr-3 rounded-full border-[1.5px] transition-all duration-200 ${
                avatarOpen
                  ? "border-white/30 bg-white/[0.08]"
                  : "border-white/15 bg-transparent hover:bg-white/[0.08] hover:border-white/30"
              }`}
            >
              {user.photo ? (
                <img
                  src={user.photo}
                  alt={user.firstName}
                  className="w-[34px] h-[34px] rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-[34px] h-[34px] rounded-full bg-primary text-primary-foreground font-outfit font-bold text-sm flex items-center justify-center uppercase">
                  {initials}
                </div>
              )}
              <span className="text-sm text-white font-normal hidden md:inline">{user.firstName}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 ${avatarOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Avatar dropdown */}
            <div
              className={`absolute right-0 top-full mt-2.5 min-w-[220px] rounded-xl border border-[#2A2A2A] bg-[#161616] py-2 shadow-[0_16px_40px_rgba(0,0,0,0.45)] z-50 transition-all duration-200 ${
                avatarOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1.5 pointer-events-none"
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[#2A2A2A] mb-1">
                {user.photo ? (
                  <img src={user.photo} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-primary" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-outfit font-bold text-xs flex items-center justify-center uppercase">
                    {initials}
                  </div>
                )}
                <div>
                  <p className="text-sm font-outfit font-semibold text-white leading-tight">{user.fullName}</p>
                  <p className="text-xs text-[#888888] leading-tight">{user.email}</p>
                </div>
              </div>

              {/* Menu items */}
              <button
                onClick={() => { setAvatarOpen(false); navigate("/profile"); }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#cccccc] hover:bg-white/[0.06] hover:text-white transition-colors duration-150"
              >
                <User className="w-4 h-4" /> My Profile
              </button>
              <button
                onClick={() => { setAvatarOpen(false); navigate("/history"); }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#cccccc] hover:bg-white/[0.06] hover:text-white transition-colors duration-150"
              >
                <Clock className="w-4 h-4" /> My History
              </button>
              <button
                onClick={() => { setAvatarOpen(false); navigate("/settings"); }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#cccccc] hover:bg-white/[0.06] hover:text-white transition-colors duration-150"
              >
                <Settings className="w-4 h-4" /> Settings
              </button>

              <div className="border-t border-[#2A2A2A] my-1" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#FF6B6B] hover:bg-red-500/[0.08] hover:text-[#FF4444] transition-colors duration-150"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </div>
        )}

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1 px-3.5 py-[9px] text-sm text-secondary-foreground border border-border rounded-md hover:border-primary hover:text-primary transition-all duration-200"
          >
            {currentLangObj.label}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg py-1 min-w-[140px] shadow-xl z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLang(lang.code)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-hover transition-colors ${
                    currentLang === lang.code ? "text-primary" : "text-body"
                  }`}
                >
                  {lang.native}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile hamburger */}
      <button className="md:hidden text-heading" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 w-full bg-surface border-t border-border md:hidden z-50 animate-page-enter">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-outfit transition-colors ${
                  location.pathname === link.path ? "text-heading font-bold" : "text-body"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-border" />
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="text-center py-2.5 text-sm text-secondary-foreground border border-border rounded-md"
                >
                  Log In
                </Link>
                <Link
                  to="/login"
                  className="text-center py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-md"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 py-2">
                  {user.photo ? (
                    <img src={user.photo} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-primary" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-outfit font-bold text-sm flex items-center justify-center uppercase">
                      {initials}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-outfit font-semibold text-heading">{user.fullName}</p>
                    <p className="text-xs text-body">{user.email}</p>
                  </div>
                </div>
                <Link to="/profile" className="text-sm text-body hover:text-heading transition-colors flex items-center gap-2">
                  <User className="w-4 h-4" /> My Profile
                </Link>
                <Link to="/history" className="text-sm text-body hover:text-heading transition-colors flex items-center gap-2">
                  <Clock className="w-4 h-4" /> My History
                </Link>
                <hr className="border-border" />
                <button onClick={handleLogout} className="text-sm text-[#FF6B6B] hover:text-[#FF4444] transition-colors flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
