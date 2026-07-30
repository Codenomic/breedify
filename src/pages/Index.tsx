import { Link } from "react-router-dom";
import { Camera, Target, BookOpen, Cpu, Globe, Leaf, Zap } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { heritageBreeds } from "@/data/breeds";
import heroBackground from "@/assets/hero-bg.jpg";

const steps = [
  {
    num: "01",
    icon: Camera,
    title: "Capture",
    desc: "Take a clear photo of the cattle from the side or front in good lighting.",
  },
  {
    num: "02",
    icon: Target,
    title: "Identify",
    desc: "Our AI engine analyzes key physical traits and matches the breed in seconds.",
  },
  {
    num: "03",
    icon: BookOpen,
    title: "Discover",
    desc: "Get full breed details — milk yield, weight, price, diseases, and more.",
  },
];

const stats = [
  { value: "40+", label: "Native Breeds Covered" },
  { value: "97%+", label: "Identification Accuracy" },
  { value: "100%", label: "Proudly Indian" },
];

const whyCards = [
  {
    icon: Cpu,
    title: "AI-Powered Accuracy",
    desc: "Trained on thousands of Indian breed images for 97%+ identification accuracy.",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    desc: "Available in Hindi, Punjabi, Gujarati, Tamil and English.",
  },
  {
    icon: Leaf,
    title: "Heritage Preservation",
    desc: "Helping document and protect India's 40+ native cattle and buffalo breeds.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    desc: "Get complete breed analysis in under 3 seconds.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background animate-page-enter">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBackground}
            alt="Cattle grazing in green field"
            className="w-full h-full object-cover object-center animate-hero-zoom"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="font-tenor text-primary text-[13px] font-bold tracking-[0.18em] uppercase mb-6 [text-shadow:0_0_20px_rgba(196,255,51,0.45)]">
            AI-Powered Breed Recognition
          </p>
          <h1 className="font-outfit text-[34px] sm:text-[clamp(42px,6vw,64px)] font-bold text-white leading-[1.05] mb-[10px]">
            Every Cattle Has A Story...
          </h1>
          <h2 className="font-outfit text-[28px] sm:text-[clamp(36px,5vw,56px)] font-bold text-primary leading-[1.05] mb-6">
            Find Yours.
          </h2>
          <p className="text-[clamp(15px,2vw,19px)] sm:text-[clamp(16px,2vw,19px)] text-white/95 max-w-[560px] mx-auto mb-9 leading-[1.7] [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]">
            Upload a photo of any cattle breed and let AI identify it in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center items-center flex-wrap">
            <Link
              to="/identify"
              className="w-full sm:w-auto max-w-[320px] px-10 py-4 bg-primary text-primary-foreground font-bold text-base rounded-lg border-none hover:brightness-95 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(196,255,51,0.35)] transition-all duration-200"
            >
              Start Identifying
            </Link>
            <Link
              to="/breeds"
              className="w-full sm:w-auto max-w-[320px] px-10 py-4 bg-transparent text-primary font-bold text-base rounded-lg border-2 border-primary hover:bg-primary/[0.08] hover:-translate-y-0.5 hover:shadow-[0_0_16px_rgba(196,255,51,0.2)] transition-all duration-200"
            >
              Explore Breeds
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-[80px] px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="font-tenor text-primary text-xs tracking-[0.16em] uppercase mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-heading mb-12">
            Three simple steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-card border border-border rounded-xl p-6 hover:bg-[hsl(0,0%,10.2%)] hover:border-[hsl(var(--border-hover))] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] transition-all duration-200"
              >
                <span className="font-tenor text-primary text-xs tracking-[0.14em]">{step.num}</span>
                <div className="w-12 h-12 mx-auto my-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-heading mb-2">{step.title}</h3>
                <p className="text-body text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-border">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
              <p className="text-body text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Heritage Spotlight */}
      <section className="py-20 md:py-[80px] px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="font-tenor text-primary text-xs tracking-[0.16em] uppercase mb-3">
            Heritage Spotlight
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-heading mb-12">
            Meet India's finest breeds
          </h2>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            effect="slide"
            centeredSlides={true}
            slidesPerView={1}
            loop={true}
            speed={500}
            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            navigation={true}
            className="heritage-swiper max-w-3xl [&_.swiper-button-next]:text-primary [&_.swiper-button-prev]:text-primary [&_.swiper-pagination-bullet-active]:!bg-primary [&_.swiper-pagination-bullet]:bg-body"
          >
            {heritageBreeds.map((breed) => (
              <SwiperSlide key={breed.name}>
                <div className="pb-12">
                  <div className="rounded-2xl overflow-hidden mb-6 aspect-[16/9]">
                    <img
                      src={breed.image}
                      alt={breed.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-heading mb-2">{breed.name}</h3>
                  <p className="text-body text-sm max-w-md mx-auto">{breed.fact}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Why Breedify */}
      <section className="py-20 md:py-[80px] px-6 bg-surface">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="font-tenor text-primary text-xs tracking-[0.16em] uppercase mb-3">
            Why Breedify
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-heading mb-12">
            Built for Indian farmers, by Indian innovators
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyCards.map((card) => (
              <div
                key={card.title}
                className="bg-card border border-border rounded-xl p-6 hover:bg-[hsl(0,0%,10.2%)] hover:border-[hsl(var(--border-hover))] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] transition-all duration-200"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/15 flex items-center justify-center">
                  <card.icon className="w-6 h-6 text-accent-light" />
                </div>
                <h3 className="text-lg font-bold text-heading mb-2">{card.title}</h3>
                <p className="text-body text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
