import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  Camera,
  Check,
  ChevronRight,
  Clapperboard,
  Film,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Phone,
  Play,
  Star,
  Video,
  X,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { SiFacebook, SiVimeo } from "react-icons/si";
import { toast } from "sonner";
import { useSubmitEnquiry } from "../hooks/useQueries";

const LOGO_PATH =
  "/assets/uploads/60f66648-87bd-4522-ba3b-20bd6cf14069-019d347b-c35e-75cb-8910-fcca614bd0e3-1.jpeg";

const NAV_LINKS = [
  { label: "Work", href: "#portfolio" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#pricing" },
  { label: "Book", href: "#booking" },
  { label: "Contact", href: "#contact" },
];

const SERVICES = [
  {
    icon: Film,
    title: "Weddings & Events",
    desc: "Timeless cinematic wedding films that capture every cherished moment and emotion.",
  },
  {
    icon: Clapperboard,
    title: "Corporate & Commercial",
    desc: "High-impact brand videos that elevate your corporate identity and drive results.",
  },
  {
    icon: Video,
    title: "Music Videos",
    desc: "Creative visual storytelling that amplifies your music and connects with audiences.",
  },
  {
    icon: Camera,
    title: "Documentaries & Editorial",
    desc: "Compelling narrative films from real estate tours to fashion editorials.",
  },
];

const PORTFOLIO = [
  {
    title: "Wedding Story",
    category: "Wedding",
    gradient: "from-rose-900/80 to-pink-900/50",
  },
  {
    title: "Corporate Summit",
    category: "Corporate",
    gradient: "from-blue-900/80 to-cyan-900/50",
  },
  {
    title: "Music Video",
    category: "Music",
    gradient: "from-purple-900/80 to-violet-900/50",
  },
  {
    title: "Real Estate Showcase",
    category: "Real Estate",
    gradient: "from-emerald-900/80 to-teal-900/50",
  },
  {
    title: "Adventure Travel",
    category: "Travel",
    gradient: "from-amber-900/80 to-orange-900/50",
  },
  {
    title: "Fashion Editorial",
    category: "Fashion",
    gradient: "from-indigo-900/80 to-blue-900/50",
  },
];

const PRICING = [
  {
    name: "Essential",
    features: [
      "Up to 4 hours filming",
      "1 videographer",
      "Basic edit",
      "2 min highlight reel",
      "Digital delivery",
    ],
  },
  {
    name: "Premium",
    featured: true,
    features: [
      "Up to 8 hours filming",
      "2 videographers",
      "Advanced edit",
      "5 min highlight reel",
      "Drone footage",
      "Same day edit available",
    ],
  },
  {
    name: "Elite",
    features: [
      "Full day filming",
      "3 videographers",
      "Cinematic grade edit",
      "10 min feature film",
      "Drone footage",
      "Raw footage included",
      "2 revision rounds",
    ],
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Absolutely stunning work. They captured every moment perfectly. We watch our wedding film over and over — pure magic.",
    name: "Sarah M.",
    role: "Wedding Client",
    initials: "SM",
    rating: 5,
  },
  {
    quote:
      "Our corporate video exceeded all expectations. Professional, creative, and delivered on time. Highly recommend.",
    name: "James K.",
    role: "Marketing Director",
    initials: "JK",
    rating: 5,
  },
  {
    quote:
      "The music video was beyond what we imagined. Pure cinematic gold. Our fans absolutely love the final result.",
    name: "Alex R.",
    role: "Recording Artist",
    initials: "AR",
    rating: 5,
  },
];

const SERVICES_LIST = [
  "Weddings",
  "Corporate Events",
  "Music Videos",
  "Real Estate",
  "Commercials",
  "Documentaries",
  "Social Media Content",
  "Sports Events",
  "Concerts & Live Events",
  "Fashion & Editorial",
  "Product Launches",
  "Travel & Adventure",
];

function GradientButton({
  children,
  className = "",
  onClick,
  type = "button",
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-white text-sm tracking-wide transition-all duration-300 gradient-bg hover:shadow-glow hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
    >
      {children}
    </button>
  );
}

function SectionTitle({
  title,
  subtitle,
}: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-14">
      <h2 className="font-heading font-black text-2xl md:text-3xl lg:text-4xl tracking-widest uppercase text-foreground mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
          {subtitle}
        </p>
      )}
      <div className="flex justify-center mt-4">
        <div className="h-0.5 w-16 gradient-bg rounded-full" />
      </div>
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-ocid="nav.link"
            className="cursor-pointer"
          >
            <img
              src={LOGO_PATH}
              alt="Metric Visuals"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors tracking-wide"
                data-ocid="nav.link"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <GradientButton
              onClick={() => scrollTo("#booking")}
              data-ocid="nav.primary_button"
            >
              GET STARTED
            </GradientButton>
            <Link
              to="/admin"
              className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
              data-ocid="nav.link"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu btn */}
          <button
            type="button"
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.toggle"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/98 backdrop-blur-md border-t border-border"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <button
                  type="button"
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="text-left text-foreground font-medium py-2 tracking-wide border-b border-border/40"
                  data-ocid="nav.link"
                >
                  {link.label}
                </button>
              ))}
              <GradientButton
                onClick={() => scrollTo("#booking")}
                className="mt-2 w-full"
              >
                GET STARTED
              </GradientButton>
              <Link
                to="/admin"
                className="text-center text-muted-foreground text-sm"
                data-ocid="nav.link"
              >
                Admin Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function HeroSection() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center hero-bg overflow-hidden"
      id="hero"
    >
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <p className="text-xs md:text-sm tracking-[0.4em] text-primary font-medium uppercase mb-6">
            Premium Videography Studio
          </p>
          <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter uppercase leading-none mb-6">
            <span className="block text-foreground">CINEMATIC STORIES.</span>
            <span className="block gradient-text">ELEVATED VISUALS.</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            We craft visually stunning films that captivate audiences, preserve
            memories, and transform your story into cinematic art.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GradientButton
              onClick={() => scrollTo("#booking")}
              className="px-8 py-4 text-base"
              data-ocid="hero.primary_button"
            >
              BOOK A CONSULTATION
            </GradientButton>
            <button
              type="button"
              onClick={() => scrollTo("#portfolio")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-foreground font-semibold text-sm tracking-wide hover:border-primary/50 hover:text-primary transition-all duration-300"
              data-ocid="hero.secondary_button"
            >
              <Play size={16} className="fill-current" />
              VIEW OUR WORK
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { val: "500+", label: "Projects Completed" },
            { val: "8+", label: "Years Experience" },
            { val: "100%", label: "Client Satisfaction" },
          ].map((stat) => (
            <div key={stat.val} className="text-center">
              <p className="font-heading font-black text-2xl md:text-3xl gradient-text">
                {stat.val}
              </p>
              <p className="text-muted-foreground text-xs mt-1 tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-primary/60" />
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Our Services"
          subtitle="From intimate weddings to large-scale productions, we deliver cinematic excellence across every genre."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="card-sheen rounded-2xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              data-ocid={`services.card.${i + 1}`}
            >
              <div className="absolute inset-x-0 top-0 h-0.5 gradient-bg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <service.icon size={22} className="text-white" />
              </div>
              <h3 className="font-heading font-bold text-base text-foreground mb-3 tracking-wide">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {service.desc}
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-semibold tracking-widest uppercase gradient-text hover:gap-2 transition-all duration-200"
                onClick={() =>
                  document
                    .querySelector("#booking")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                LEARN MORE <ChevronRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioSection() {
  return (
    <section id="portfolio" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="The Portfolio"
          subtitle="A selection of our finest cinematic work across genres and industries."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PORTFOLIO.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group relative rounded-2xl overflow-hidden aspect-video cursor-pointer"
              data-ocid={`portfolio.item.${i + 1}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} group-hover:scale-105 transition-transform duration-500`}
              />
              {/* Film grain texture */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
                }}
              />
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-2 border-white/60 flex items-center justify-center bg-black/30 group-hover:border-white group-hover:bg-black/50 group-hover:scale-110 transition-all duration-300">
                  <Play size={18} className="text-white fill-white ml-1" />
                </div>
              </div>
              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-xs text-primary font-semibold tracking-widest uppercase">
                  {item.category}
                </span>
                <h3 className="font-heading font-bold text-white text-lg mt-1">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-background" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <Camera size={42} className="text-white" />
                  </div>
                  <p className="font-heading font-black text-5xl gradient-text">
                    MV
                  </p>
                  <p className="text-muted-foreground text-sm tracking-widest mt-2">
                    EST. 2016
                  </p>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 card-sheen rounded-2xl p-5 shadow-xl">
              <p className="font-heading font-black text-3xl gradient-text">
                500+
              </p>
              <p className="text-muted-foreground text-xs tracking-widest">
                FILMS MADE
              </p>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs tracking-[0.4em] text-primary font-semibold uppercase mb-4">
              Our Approach
            </p>
            <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-foreground mb-6 leading-none">
              CRAFTING
              <br />
              <span className="gradient-text">VISUAL POETRY</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              At Metric Visuals, we believe every story deserves to be told
              beautifully. Our team of seasoned cinematographers and editors
              bring unparalleled creativity and technical mastery to every
              project — from intimate weddings to global brand campaigns.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We don't just film — we create immersive visual experiences that
              move audiences, evoke emotion, and stand the test of time. Our
              cinematic approach blends artistry with precision to deliver work
              that exceeds expectations.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                {
                  label: "Pre-Production Planning",
                  desc: "Meticulous preparation",
                },
                { label: "Cinematic Filming", desc: "Premium equipment" },
                {
                  label: "Expert Post-Production",
                  desc: "Professional grading",
                },
                { label: "Fast Delivery", desc: "On time, every time" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={10} className="text-white" />
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-semibold">
                      {item.label}
                    </p>
                    <p className="text-muted-foreground text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <GradientButton
              onClick={() =>
                document
                  .querySelector("#booking")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-ocid="about.primary_button"
            >
              START YOUR PROJECT
            </GradientButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Pricing Packages"
          subtitle="Transparent pricing for every production scale. All packages include full rights to your final film."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative rounded-2xl p-8 flex flex-col ${
                pkg.featured
                  ? "gradient-bg shadow-glow scale-105"
                  : "card-sheen hover:border-primary/30 transition-all duration-300"
              }`}
              data-ocid={`pricing.card.${i + 1}`}
            >
              {pkg.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-background text-xs font-black px-4 py-1 rounded-full tracking-widest uppercase">
                  MOST POPULAR
                </div>
              )}
              <h3
                className={`font-heading font-black text-xl uppercase tracking-widest mb-6 ${pkg.featured ? "text-white" : "text-foreground"}`}
              >
                {pkg.name}
              </h3>
              <ul className="space-y-3 flex-1 mb-8">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${pkg.featured ? "bg-white/20" : "gradient-bg"}`}
                    >
                      <Check
                        size={10}
                        className={pkg.featured ? "text-white" : "text-white"}
                      />
                    </div>
                    <span
                      className={`text-sm ${pkg.featured ? "text-white/90" : "text-muted-foreground"}`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              {pkg.featured ? (
                <button
                  type="button"
                  onClick={() =>
                    document
                      .querySelector("#booking")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="w-full py-3 rounded-full bg-white text-background font-black text-sm tracking-widest uppercase hover:bg-white/90 transition-colors"
                  data-ocid={`pricing.primary_button.${i + 1}`}
                >
                  GET A QUOTE
                </button>
              ) : (
                <GradientButton
                  onClick={() =>
                    document
                      .querySelector("#booking")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="w-full"
                  data-ocid={`pricing.primary_button.${i + 1}`}
                >
                  GET A QUOTE
                </GradientButton>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Client Stories"
          subtitle="Hear what our clients say about working with Metric Visuals."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="card-sheen rounded-2xl p-8 relative overflow-hidden group hover:border-primary/30 transition-all duration-300"
              data-ocid={`testimonials.card.${i + 1}`}
            >
              <div className="absolute top-4 right-4 text-6xl font-serif text-primary/10 leading-none select-none">
                &#8220;
              </div>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].slice(0, t.rating).map((n) => (
                  <Star
                    key={n}
                    size={14}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xs">
                  {t.initials}
                </div>
                <div>
                  <p className="text-foreground font-semibold text-sm">
                    {t.name}
                  </p>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnquiryFormSection() {
  const { mutateAsync: submitEnquiry, isPending } = useSubmitEnquiry();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    eventDate: "",
    location: "",
    duration: "",
    budgetRange: "",
    message: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.serviceType) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await submitEnquiry(form);
      toast.success("Enquiry submitted! We'll be in touch within 24 hours.");
      setForm({
        name: "",
        email: "",
        phone: "",
        serviceType: "",
        eventDate: "",
        location: "",
        duration: "",
        budgetRange: "",
        message: "",
      });
    } catch {
      toast.error("Failed to submit enquiry. Please try again.");
    }
  };

  const inputClass =
    "bg-input border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-0 rounded-xl h-12";

  return (
    <section id="booking" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs tracking-[0.4em] text-primary font-semibold uppercase mb-4">
              Let's Connect
            </p>
            <h2 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">
              BOOK A <span className="gradient-text">CONSULTATION</span>
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
              Tell us about your project and we'll craft a tailored proposal for
              you.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              data-ocid="booking.dialog"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold tracking-wide uppercase">
                    Full Name *
                  </Label>
                  <Input
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Your full name"
                    className={inputClass}
                    data-ocid="booking.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold tracking-wide uppercase">
                    Email *
                  </Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="your@email.com"
                    className={inputClass}
                    data-ocid="booking.input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold tracking-wide uppercase">
                    Phone *
                  </Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+44 7700 000000"
                    className={inputClass}
                    data-ocid="booking.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold tracking-wide uppercase">
                    Service *
                  </Label>
                  <Select
                    value={form.serviceType}
                    onValueChange={(v) => handleChange("serviceType", v)}
                  >
                    <SelectTrigger
                      className={`${inputClass} w-full`}
                      data-ocid="booking.select"
                    >
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {SERVICES_LIST.map((s) => (
                        <SelectItem
                          key={s}
                          value={s}
                          className="text-foreground hover:bg-muted"
                        >
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold tracking-wide uppercase">
                    Event Date
                  </Label>
                  <Input
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => handleChange("eventDate", e.target.value)}
                    className={`${inputClass} [color-scheme:dark]`}
                    data-ocid="booking.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold tracking-wide uppercase">
                    Location
                  </Label>
                  <Input
                    value={form.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="City, Country"
                    className={inputClass}
                    data-ocid="booking.input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold tracking-wide uppercase">
                    Duration
                  </Label>
                  <Input
                    value={form.duration}
                    onChange={(e) => handleChange("duration", e.target.value)}
                    placeholder="e.g. Full day, 4 hours"
                    className={inputClass}
                    data-ocid="booking.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold tracking-wide uppercase">
                    Budget Range
                  </Label>
                  <Select
                    value={form.budgetRange}
                    onValueChange={(v) => handleChange("budgetRange", v)}
                  >
                    <SelectTrigger
                      className={`${inputClass} w-full`}
                      data-ocid="booking.select"
                    >
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {[
                        "Under ₹2,500",
                        "₹2,500 - ₹5,000",
                        "₹5,000 - ₹10,000",
                        "₹10,000+",
                        "To be discussed",
                      ].map((b) => (
                        <SelectItem
                          key={b}
                          value={b}
                          className="text-foreground hover:bg-muted"
                        >
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground text-xs font-semibold tracking-wide uppercase">
                  Project Details
                </Label>
                <Textarea
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Tell us about your vision, special requirements, or any questions..."
                  className="bg-input border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-0 rounded-xl min-h-28 resize-none"
                  data-ocid="booking.textarea"
                />
              </div>
              <GradientButton
                type="submit"
                disabled={isPending}
                className="w-full py-4 text-base"
                data-ocid="booking.submit_button"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Submitting...
                  </span>
                ) : (
                  "SUBMIT ENQUIRY"
                )}
              </GradientButton>
            </form>
          </motion.div>

          {/* Info side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:pt-16"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-background" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center mx-auto mb-4">
                    <Video size={36} className="text-white/60" />
                  </div>
                  <p className="text-white/60 text-sm tracking-widest uppercase">
                    Ready to film your story
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6" id="contact">
              <h3 className="font-heading font-bold text-lg uppercase tracking-widest text-foreground">
                Get In Touch
              </h3>
              {[
                { icon: Mail, label: "Email", val: "hello@metricvisuals.com" },
                { icon: Phone, label: "Phone", val: "+44 20 7000 0000" },
                {
                  icon: MapPin,
                  label: "Studio",
                  val: "London, United Kingdom",
                },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
                    <c.icon size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wide">
                      {c.label}
                    </p>
                    <p className="text-foreground text-sm font-medium">
                      {c.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-secondary/30 border-t border-border py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <img
              src={LOGO_PATH}
              alt="Metric Visuals"
              className="h-12 w-auto object-contain mb-4"
            />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Premium videography studio crafting cinematic stories that elevate
              brands and preserve memories.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { Icon: Instagram, href: "#", name: "instagram" },
                { Icon: Youtube, href: "#", name: "youtube" },
                { Icon: SiFacebook, href: "#", name: "facebook" },
                { Icon: SiVimeo, href: "#", name: "vimeo" },
              ].map(({ Icon, href, name }) => (
                <a
                  key={name}
                  href={href}
                  className="w-9 h-9 rounded-full card-sheen flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                  data-ocid="footer.link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-foreground mb-4">
              Services
            </h4>
            <ul className="space-y-2">
              {[
                "Weddings",
                "Corporate",
                "Music Videos",
                "Real Estate",
                "Documentaries",
              ].map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .querySelector("#services")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {[
                { label: "About", href: "#about" },
                { label: "Portfolio", href: "#portfolio" },
                { label: "Pricing", href: "#pricing" },
                { label: "Contact", href: "#contact" },
              ].map((l) => (
                <li key={l.label}>
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .querySelector(l.href)
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            © {year} Metric Visuals. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <AboutSection />
        <PricingSection />
        <TestimonialsSection />
        <EnquiryFormSection />
      </main>
      <Footer />
    </div>
  );
}
