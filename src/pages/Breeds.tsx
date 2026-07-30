import { useState, useMemo } from "react";
import { Bookmark } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { breeds, Breed } from "@/data/breeds";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, X, MapPin, Droplets, Weight, IndianRupee, Bug, Leaf, Lightbulb } from "lucide-react";

const typeFilters = ["All", "Cow", "Buffalo"] as const;
const purposeFilters = ["All", "High Milk Yield", "Dual Purpose", "Draft"] as const;
const regionFilters = ["All", "North India", "South India", "West India"] as const;

const Breeds = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [purposeFilter, setPurposeFilter] = useState<string>("All");
  const [regionFilter, setRegionFilter] = useState<string>("All");
  const [selected, setSelected] = useState<Breed | null>(null);

  const filtered = useMemo(() => {
    return breeds.filter((b) => {
      const matchSearch =
        !search ||
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.origin.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "All" || b.type === typeFilter;
      const matchPurpose = purposeFilter === "All" || b.purpose === purposeFilter;
      const matchRegion = regionFilter === "All" || b.region === regionFilter;
      return matchSearch && matchType && matchPurpose && matchRegion;
    });
  }, [search, typeFilter, purposeFilter, regionFilter]);

  const Chip = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
        active
          ? "bg-primary/15 text-primary border-primary/30"
          : "bg-secondary text-body border-border hover:border-border-hover"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-background animate-page-enter">
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-10">
          <h4 className="section-label text-primary mb-3">Library</h4>
          <h1 className="text-3xl md:text-4xl font-bold text-heading mb-3">
            Breed Encyclopedia
          </h1>
          <p className="text-body max-w-lg mx-auto">
            Explore India's 26 native cattle and buffalo breeds
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search breeds by name or origin…"
            className="pl-10 h-11 rounded-xl bg-card border-border text-heading placeholder:text-text-placeholder"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-text-muted hover:text-heading transition-colors" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {typeFilters.map((f) => (
            <Chip key={f} label={f} active={typeFilter === f} onClick={() => setTypeFilter(f)} />
          ))}
          <div className="w-px h-6 bg-border self-center mx-1" />
          {purposeFilters.map((f) => (
            <Chip key={f} label={f} active={purposeFilter === f} onClick={() => setPurposeFilter(f)} />
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {regionFilters.map((f) => (
            <Chip key={f} label={f} active={regionFilter === f} onClick={() => setRegionFilter(f)} />
          ))}
        </div>

        {/* Count */}
        <p className="text-text-muted text-sm mb-6">
          {filtered.length} breed{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-heading text-lg mb-2">No breeds found</p>
            <p className="text-body text-sm">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-5 max-sm:gap-3">
            {filtered.map((breed) => (
              <button
                key={breed.name}
                onClick={() => setSelected(breed)}
                className="group relative rounded-[20px] overflow-hidden cursor-pointer aspect-[3/4] w-full text-left transition-all duration-250 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(0,0,0,0.22)]"
              >
                {/* Full-bleed image */}
                <img
                  src={breed.image}
                  alt={breed.name}
                  className="w-full h-full object-cover object-center block transition-transform duration-400 ease-out group-hover:scale-105"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.80) 100%)' }} />

                {/* Bookmark button */}
                <div
                  className="absolute top-3.5 right-3.5 z-[2] w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:bg-white/[0.38] hover:scale-110"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Bookmark className="w-4 h-4 text-white" strokeWidth={1.8} />
                </div>

                {/* Bottom text overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-[2] px-4 pb-4 pt-5 sm:px-[18px] sm:pb-[18px] sm:pt-5">
                  <h3 className="font-outfit font-bold text-lg sm:text-[22px] text-white leading-tight mb-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                    {breed.name}
                  </h3>
                  <p className="font-tenor text-xs sm:text-sm text-white/85" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.35)' }}>
                    {breed.origin}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <div className="relative h-56 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-lg">
                <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <Badge className="bg-primary text-primary-foreground mb-2">{selected.type}</Badge>
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-heading">{selected.name}</DialogTitle>
                  </DialogHeader>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                  {selected.purpose}
                </Badge>
                <Badge variant="outline" className="border-accent/30 text-accent-foreground bg-accent/10">
                  {selected.region}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <DetailItem icon={<MapPin className="w-4 h-4 text-primary" />} label="Origin" value={selected.origin} />
                <DetailItem icon={<Droplets className="w-4 h-4 text-primary" />} label="Milk Yield" value={selected.milkYield} />
                <DetailItem icon={<Weight className="w-4 h-4 text-primary" />} label="Weight" value={selected.weight} />
                <DetailItem icon={<IndianRupee className="w-4 h-4 text-primary" />} label="Price Range" value={selected.price} />
                <DetailItem icon={<Bug className="w-4 h-4 text-destructive" />} label="Common Diseases" value={selected.diseases} />
                <DetailItem icon={<Leaf className="w-4 h-4 text-primary" />} label="Nutrition" value={selected.nutrition} />
              </div>

              <div className="rounded-xl bg-secondary/50 border border-border p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-heading text-sm font-semibold mb-1">Did you know?</p>
                    <p className="text-body text-sm leading-relaxed">{selected.fact}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
    <div className="mt-0.5">{icon}</div>
    <div>
      <p className="text-text-muted text-[11px] uppercase tracking-wider font-tenor mb-0.5">{label}</p>
      <p className="text-heading text-sm">{value}</p>
    </div>
  </div>
);

export default Breeds;
