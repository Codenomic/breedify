import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Clock, Trash2, Search, Camera } from "lucide-react";

export interface HistoryEntry {
  id: string;
  breedName: string;
  confidence: number;
  date: string;
  imageUrl: string;
}

const STORAGE_KEY = "breedify_history";

const getHistory = (): HistoryEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const History = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  const removeEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearAll = () => {
    setEntries([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const filtered = entries.filter((e) =>
    e.breedName.toLowerCase().includes(search.toLowerCase())
  );

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-[#C4FF33]";
    if (confidence >= 70) return "text-[#A56EF5]";
    return "text-[#888888]";
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] animate-page-enter">
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-[#C4FF33]" />
              <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
                Scan History
              </h1>
            </div>
            <p className="text-[#888888]" style={{ fontFamily: "Outfit, sans-serif" }}>
              Your previously identified cattle breeds
            </p>
          </div>
          {entries.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-[#555555] hover:text-red-400 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Search */}
        {entries.length > 0 && (
          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" />
            <input
              type="text"
              placeholder="Search history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#161616] border border-[#2A2A2A] rounded-lg text-white text-sm placeholder:text-[#555555] focus:outline-none focus:border-[#C4FF33]/50 transition-colors"
              style={{ fontFamily: "Outfit, sans-serif" }}
            />
          </div>
        )}

        {/* Content */}
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-[#161616] border border-[#2A2A2A] flex items-center justify-center mb-6">
              <Camera className="w-8 h-8 text-[#555555]" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
              No scans yet
            </h2>
            <p className="text-[#888888] mb-6 max-w-sm" style={{ fontFamily: "Outfit, sans-serif" }}>
              Start identifying cattle breeds and your scan history will appear here.
            </p>
            <button
              onClick={() => navigate("/identify")}
              className="px-6 py-2.5 bg-[#C4FF33] text-[#0D0D0D] font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(196,255,51,0.3)] hover:-translate-y-0.5 transition-all"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Start Scanning
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-[#555555] py-16" style={{ fontFamily: "Outfit, sans-serif" }}>
            No results matching "{search}"
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((entry) => (
              <div
                key={entry.id}
                className="group flex items-center gap-4 p-4 bg-[#161616] border border-[#2A2A2A] rounded-xl hover:border-[#333333] hover:-translate-y-0.5 transition-all cursor-pointer"
                onClick={() => navigate("/result", { state: { fromHistory: true, breedName: entry.breedName, imageUrl: entry.imageUrl, savedConfidence: entry.confidence } })}
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#111111]">
                  <img
                    src={entry.imageUrl}
                    alt={entry.breedName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate" style={{ fontFamily: "Outfit, sans-serif" }}>
                    {entry.breedName}
                  </h3>
                  <p className="text-xs text-[#555555] mt-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>
                    {new Date(entry.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Confidence */}
                <div className="text-right flex-shrink-0">
                  <span className={`text-lg font-bold ${getConfidenceColor(entry.confidence)}`} style={{ fontFamily: "Outfit, sans-serif" }}>
                    {entry.confidence}%
                  </span>
                  <p className="text-[10px] text-[#555555] uppercase tracking-wider" style={{ fontFamily: "Tenor Sans, sans-serif" }}>
                    confidence
                  </p>
                </div>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeEntry(entry.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-[#555555] hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default History;
