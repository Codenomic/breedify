import { useState } from "react";
import { Pencil, Check, X, LogOut, Camera, User } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfileField {
  label: string;
  key: string;
  type: string;
  required: boolean;
  placeholder: string;
  rows?: number;
}

const fields: ProfileField[] = [
  { label: "Full Name", key: "fullName", type: "text", required: true, placeholder: "Enter your full name" },
  { label: "Mobile Number", key: "mobile", type: "tel", required: true, placeholder: "+91 00000 00000" },
  { label: "Email Address", key: "email", type: "email", required: false, placeholder: "your@email.com" },
  { label: "Address", key: "address", type: "textarea", required: false, placeholder: "Enter your address", rows: 3 },
];

const loadProfile = () => {
  try {
    const saved = localStorage.getItem("breedify_profile");
    return saved ? JSON.parse(saved) : { fullName: "", mobile: "", email: "", address: "" };
  } catch {
    return { fullName: "", mobile: "", email: "", address: "" };
  }
};

const Profile = () => {
  const [profile, setProfile] = useState<Record<string, string>>(loadProfile);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => localStorage.getItem("breedify_avatar"));

  const startEdit = (key: string) => {
    setEditingField(key);
    setEditValue(profile[key] || "");
  };

  const saveField = (key: string) => {
    const updated = { ...profile, [key]: editValue };
    setProfile(updated);
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleSaveProfile = () => {
    localStorage.setItem("breedify_profile", JSON.stringify(profile));
    toast.success("Profile updated successfully ✓", {
      duration: 3000,
      style: {
        background: "#161616",
        border: "0.5px solid #C4FF33",
        color: "#C4FF33",
      },
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setAvatarUrl(url);
      localStorage.setItem("breedify_avatar", url);
    };
    reader.readAsDataURL(file);
  };

  const handleSignOut = () => {
    toast("Signed out successfully");
  };

  return (
    <div className="min-h-screen bg-background animate-page-enter">
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-6 py-20 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold text-heading text-center mb-10">
          My Profile
        </h1>

        <div className="max-w-lg mx-auto">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-2 border-border">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="bg-secondary text-muted-foreground">
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <label
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200"
              >
                <Camera className="h-5 w-5 text-primary" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <button
              onClick={() => document.querySelector<HTMLInputElement>('.profile-avatar-input')?.click()}
              className="mt-3 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Change Photo
            </button>
          </div>

          {/* Editable Fields */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            {fields.map((field) => (
              <div key={field.key}>
                <div className="flex items-center gap-1 mb-1.5">
                  <span className="section-label text-muted-foreground text-xs">
                    {field.label}
                  </span>
                  {field.required && (
                    <span className="text-primary text-xs">*</span>
                  )}
                </div>

                {editingField === field.key ? (
                  <div className="flex items-start gap-2">
                    {field.type === "textarea" ? (
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        rows={field.rows || 3}
                        className="flex-1 bg-[hsl(var(--bg-hover))] border border-primary rounded-md px-3 py-2 text-sm text-heading placeholder:text-muted-foreground outline-none resize-none transition-all duration-200"
                        placeholder={field.placeholder}
                        autoFocus
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 bg-[hsl(var(--bg-hover))] border border-primary rounded-md px-3 py-2 text-sm text-heading placeholder:text-muted-foreground outline-none transition-all duration-200"
                        placeholder={field.placeholder}
                        autoFocus
                      />
                    )}
                    <button
                      onClick={() => saveField(field.key)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-md transition-all duration-200"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-2 text-muted-foreground hover:text-destructive rounded-md transition-all duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-between group cursor-pointer"
                    onClick={() => startEdit(field.key)}
                  >
                    <span className={`text-sm ${profile[field.key] ? "text-heading" : "text-muted-foreground"}`}>
                      {profile[field.key] || field.placeholder}
                    </span>
                    <Pencil className="h-4 w-4 text-border-hover group-hover:text-primary transition-colors duration-200" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSaveProfile}
            className="w-full mt-6 bg-primary text-primary-foreground font-semibold hover:shadow-[0_0_20px_rgba(196,255,51,0.3)] hover:-translate-y-0.5 transition-all duration-200"
          >
            Save Profile
          </Button>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full mt-6 text-sm text-muted-foreground hover:text-destructive transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
