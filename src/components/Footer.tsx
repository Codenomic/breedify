import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-tanker text-heading text-2xl tracking-[0.04em] uppercase mb-3">
              Breedify
            </h3>
            <p className="text-body text-sm leading-relaxed">
              Identify. Learn. Preserve.
            </p>
          </div>

          {/* About */}
          <div>
            <h4 className="section-label text-heading mb-4">About Us</h4>
            <p className="text-body text-sm leading-relaxed">
              Breedify is India's first AI-powered cattle breed recognition platform, helping farmers,
              veterinarians, and agriculture enthusiasts identify and learn about native Indian breeds.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="section-label text-heading mb-4">Contact Us</h4>
            <div className="flex flex-col gap-2 text-sm text-body">
              <span>Phone: +91 XXXXX XXXXX</span>
              <span>Email: hello@breedify.in</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="section-label text-heading mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm">
              {[
                { label: "Home", path: "/" },
                { label: "Identify", path: "/identify" },
                { label: "Breeds", path: "/breeds" },
                { label: "History", path: "/history" },
                { label: "Login", path: "/login" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-body hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-body">
          Made by Vidhish & Ayush
        </div>
      </div>
    </footer>
  );
};

export default Footer;
