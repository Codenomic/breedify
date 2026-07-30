import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { breeds } from "@/data/breeds";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MapPin, Droplets, Weight, IndianRupee, Bug, Leaf, Lightbulb,
  ArrowLeft, RotateCcw, ChevronRight,
} from "lucide-react";

import { useEffect, useRef } from "react";

const HISTORY_KEY = "breedify_history";

// Simulated result — picks a random breed & generates mock confidence
const useResult = () => {
  const location = useLocation();
  const passed = location.state as {
    breedIndex?: number;
    imageUrl?: string;
    fromHistory?: boolean;
    breedName?: string;
    savedConfidence?: number;
  } | null;

  // If coming from History, look up breed by name
  const breed = passed?.fromHistory && passed.breedName
    ? breeds.find((b) => b.name === passed.breedName) || breeds[Math.floor(Math.random() * breeds.length)]
    : breeds[passed?.breedIndex ?? Math.floor(Math.random() * breeds.length)];

  const imageUrl = passed?.imageUrl || breed.image;
  const confidence = passed?.fromHistory && passed.savedConfidence
    ? passed.savedConfidence
    : 87 + Math.random() * 10;
  const fromHistory = !!passed?.fromHistory;

  const similar = breeds
    .filter((b) => b.name !== breed.name && b.type === breed.type)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map((b) => ({ ...b, confidence: 30 + Math.random() * 40 }));

  return { breed, confidence, similar, imageUrl, fromHistory };
};

const Result = () => {
  const navigate = useNavigate();
  const { breed, confidence, similar, imageUrl, fromHistory } = useResult();
  const savedRef = useRef(false);

  // Save to history on first render (skip if re-opening from history)
  useEffect(() => {
    if (savedRef.current || fromHistory) return;
    savedRef.current = true;
    try {
      const existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      const entry = {
        id: crypto.randomUUID(),
        breedName: breed.name,
        confidence: parseFloat(confidence.toFixed(1)),
        date: new Date().toISOString(),
        imageUrl,
      };
      localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...existing]));
    } catch {}
  }, [breed.name, confidence, imageUrl, fromHistory]);

  return (
    <div className="min-h-screen bg-background animate-page-enter">
      <Navbar />

      <div className="max-w-[900px] mx-auto px-6 py-20">
        {/* Back */}
        <button
          onClick={() => navigate("/identify")}
          className="flex items-center gap-2 text-body hover:text-heading transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Identify
        </button>

        {/* Main Result Card */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden mb-8">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80">
            <img src={imageUrl} alt={breed.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <Badge className="bg-primary text-primary-foreground mb-2 text-xs">{breed.type}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-heading mb-2">{breed.name}</h1>
              <p className="text-body text-sm">{breed.origin} · {breed.region}</p>
            </div>
          </div>

          {/* Confidence */}
          <div className="px-6 py-5 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-heading font-semibold">AI Confidence</span>
              <span className="text-primary font-bold text-lg">{confidence.toFixed(1)}%</span>
            </div>
            <Progress value={confidence} className="h-2.5 rounded-full bg-secondary" />
            <p className="text-text-muted text-xs mt-2">
              {confidence > 90 ? "High confidence match" : "Good confidence match"} — based on visual feature analysis
            </p>
          </div>

          {/* Details Grid */}
          <div className="px-6 py-5">
            <h4 className="section-label text-primary mb-4">Breed Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DetailCard icon={<MapPin className="w-4 h-4 text-primary" />} label="Origin" value={breed.origin} />
              <DetailCard icon={<Droplets className="w-4 h-4 text-primary" />} label="Milk Yield" value={breed.milkYield} />
              <DetailCard icon={<Weight className="w-4 h-4 text-primary" />} label="Weight" value={breed.weight} />
              <DetailCard icon={<IndianRupee className="w-4 h-4 text-primary" />} label="Price Range" value={breed.price} />
              <DetailCard icon={<Bug className="w-4 h-4 text-destructive" />} label="Common Diseases" value={breed.diseases} />
              <DetailCard icon={<Leaf className="w-4 h-4 text-primary" />} label="Nutrition" value={breed.nutrition} />
            </div>
          </div>

          {/* Purpose badge */}
          <div className="px-6 pb-5">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 text-sm px-4 py-1.5">
              {breed.purpose}
            </Badge>
          </div>

          {/* Fun fact */}
          <div className="mx-6 mb-6 rounded-xl bg-secondary/50 border border-border p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-heading text-sm font-semibold mb-1">Did you know?</p>
                <p className="text-body text-sm leading-relaxed">{breed.fact}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Button
            onClick={() => navigate("/identify")}
            className="rounded-xl bg-primary text-primary-foreground hover:brightness-110 font-semibold gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Identify Another
          </Button>
        </div>

        {/* Similar Breeds */}
        {similar.length > 0 && (
          <div>
            <h4 className="section-label text-primary mb-4">Similar Breeds</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similar.map((s) => (
                <button
                  key={s.name}
                  onClick={() => navigate("/breeds")}
                  className="group text-left rounded-xl border border-border bg-card overflow-hidden hover:border-border-hover hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-heading text-sm font-semibold truncate">{s.name}</h3>
                      <ChevronRight className="w-4 h-4 text-text-muted" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={s.confidence} className="h-1.5 flex-1 rounded-full bg-secondary" />
                      <span className="text-text-muted text-xs">{s.confidence.toFixed(0)}%</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

const DetailCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
    <div className="mt-0.5">{icon}</div>
    <div>
      <p className="text-text-muted text-[11px] uppercase tracking-wider font-tenor mb-0.5">{label}</p>
      <p className="text-heading text-sm">{value}</p>
    </div>
  </div>
);

export default Result;
