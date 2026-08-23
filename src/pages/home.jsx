import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  BookOpen,
  User,
  Monitor,
  Smartphone,
  Shield,
  Calculator,
  FileText,
  MousePointer,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

//Utility: fade-in on scroll
function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

//Navbar
function Navbar() {
  // const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["Fonctionnalités", "Utilisateurs", "Fonctionnement"];
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">NoteFlow</span>
        </div>
        {/* <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l} href="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">
              {l}
            </a>
          ))}
        </div> */}
      <div className="flex items-center gap-3">
        <a
          href="https://wa.me/2250566009210?text=Bonjour%20je%20souhaite%20obtenir%20des%20informations%20sur%20NoteFlow."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2.5 rounded-lg transition-all duration-200"
        >
          Nous contacter
        </a>

        <button
          type="button"
          className="inline-flex items-center justify-center text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 hover:shadow-md"
        >
          Connexion
        </button>
      </div>
      </div>
      {/* {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l} href="#" className="text-sm text-slate-700 font-medium py-1">{l}</a>
          ))}
          <button className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg mt-2">
            Commencer
          </button>
        </div>
      )} */}
    </nav>
  );
}

//Carousel
const SLIDES = [
  {
    label: "Tableau de bord administrateur",
    src:"/images/1.png"
  },
  {
    label: "Saisie des notes — Enseignant",
    src:"/images/3.png"
  },
  {
    label: "Suivi de progression — Élève",
    src:"/images/4.png"
  },
];

function MockScreen({ slide }) {
  return (
    <div className={`w-full h-full rounded-xl bg-linear-to-br ${slide.bg} flex flex-col overflow-hidden`}>
      {/* Fake browser bar */}
      <div className="flex items-center gap-1.5 px-4 py-3 bg-white/60 backdrop-blur border-b border-white/40">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <div className="ml-3 flex-1 h-5 bg-white/60 rounded-md" />
      </div>
      {/* Fake layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-16 bg-white/40 flex flex-col items-center py-4 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-8 h-8 rounded-lg ${i === 0 ? slide.accent : "bg-white/60"}`} />
          ))}
        </div>
        {/* Main */}
        <div className="flex-1 p-4 flex flex-col gap-3">
          <div className="h-6 w-40 bg-white/70 rounded-md" />
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/60 rounded-lg p-3 h-16 flex flex-col justify-between">
                <div className="h-2 w-10 bg-slate-300/60 rounded" />
                <div className="h-4 w-8 bg-slate-400/50 rounded" />
              </div>
            ))}
          </div>
          <div className="bg-white/60 rounded-lg flex-1 p-3 flex flex-col gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-300/70" />
                <div className="h-2 flex-1 bg-slate-200/70 rounded" />
                <div className="h-2 w-8 bg-slate-300/60 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Label */}
      <div className="px-4 py-2 bg-white/30 text-xs font-medium text-slate-600 text-center">
        {slide.label}
      </div>
    </div>
  );
}

function Carousel() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [animating, setAnimating] = useState(false);

  const go = (next) => {
    if (animating) return;
    setDir(next > current ? 1 : -1);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(next);
      setAnimating(false);
    }, 300);
  };

  const prev = () => go((current - 1 + SLIDES.length) % SLIDES.length);
  const next = () => go((current + 1) % SLIDES.length);

  useEffect(() => {
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [current]);

  return (
    <div className="relative select-none">
      {/* Decorative glow */}
      <div className="absolute -inset-4 bg-blue-600/10 rounded-3xl blur-2xl" />
      <div className="relative bg-white rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden"
        style={{ aspectRatio: "16/10" }}>
        <div
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? `translateX(${dir * 32}px)`
              : "translateX(0)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            height: "100%",
          }}
        >
          <img
            src={SLIDES[current].src}
            alt={SLIDES[current].label}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      {/* Controls */}
      <div className="absolute inset-y-0 left-0 flex items-center -ml-4">
        <button
          onClick={prev}
          className="w-9 h-9 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:shadow-lg transition-all"
        >
          <ChevronLeft size={18} />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center -mr-4">
        <button
          onClick={next}
          className="w-9 h-9 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:shadow-lg transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-6 h-2 bg-blue-600" : "w-2 h-2 bg-slate-300 hover:bg-blue-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

//Hero
function Hero() {
  return (
    <section className="pt-28 pb-20 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Gestion scolaire simplifiée
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-5"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
            Simplifiez la gestion des notes de votre{" "}
            <span className="text-blue-600">établissement scolaire.</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
            NoteFlow centralise la saisie des notes, le calcul des moyennes et la génération des bulletins dans une interface claire et accessible à tous.
          </p>
          {/* <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5">
              Commencer
              <ArrowRight size={16} />
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-sm">
              Découvrir les fonctionnalités
            </button>
          </div> */}
        </div>
        <div className="px-6 md:px-0">
          <Carousel />
        </div>
      </div>
    </section>
  );
}

//Présentation
function Presentation() {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-3xl mx-auto text-center">
        <FadeIn>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">À propos</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-5">
            Une plateforme conçue pour les établissements scolaires
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            NoteFlow est un outil de gestion académique pensé pour simplifier le quotidien des administrateurs, enseignants et élèves. De la configuration initiale à la remise des bulletins, chaque étape est fluide, claire et rapide.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

//Users
const USER_CARDS = [
  {
    icon: Settings,
    role: "Administrateur",
    color: "blue",
    desc: "L'administrateur configure entièrement la plateforme selon les besoins de son établissement.",
    features: [
      "Gestion des trimestres",
      "Gestion des classes et matières",
      "Gestion des enseignants et élèves",
      "Attribution des enseignants aux classes",
      "Génération des bulletins",
      "Paramétrage de l'établissement",
    ],
  },
  {
    icon: BookOpen,
    role: "Enseignant",
    color: "indigo",
    desc: "L'enseignant dispose d'un espace dédié pour saisir et suivre les résultats de ses élèves.",
    features: [
      "Saisie des notes par classe",
      "Consultation de ses classes",
      "Impression des fiches de notes",
      "Suivi des résultats dans sa matière",
    ],
  },
  {
    icon: User,
    role: "Élève",
    color: "sky",
    desc: "L'élève accède à ses résultats et à son évolution tout au long du trimestre.",
    features: [
      "Consultation de ses notes",
      "Moyenne générale en temps réel",
      "Moyennes par matière",
      "Suivi de son évolution",
      "Accès à ses bulletins",
    ],
  },
];

const COLOR_MAP = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-600", border: "border-blue-100", icon: "bg-blue-100 text-blue-600" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-500", border: "border-indigo-100", icon: "bg-indigo-100 text-indigo-600" },
  sky: { bg: "bg-sky-50", text: "text-sky-600", dot: "bg-sky-500", border: "border-sky-100", icon: "bg-sky-100 text-sky-600" },
};

function Users() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Utilisateurs</p>
            <h2 className="text-3xl font-bold text-slate-900">Une plateforme pour chaque rôle</h2>
          </div>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {USER_CARDS.map((card, i) => {
            const c = COLOR_MAP[card.color];
            const Icon = card.icon;
            return (
              <FadeIn key={card.role} delay={i * 100}>
                <div className={`h-full border ${c.border} rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white`}>
                  <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center mb-4`}>
                    <Icon size={22} />
                  </div>
                  <h3 className={`font-bold text-lg text-slate-900 mb-2`}>{card.role}</h3>
                  <p className="text-sm text-slate-500 mb-5 leading-relaxed">{card.desc}</p>
                  <ul className="space-y-2">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Why NoteFlow 
const WHY_ITEMS = [
  { icon: Monitor, title: "Interface moderne", desc: "Un design épuré et intuitif que chacun prend en main immédiatement." },
  { icon: MousePointer, title: "Prise en main simple", desc: "Pas de formation longue — l'interface guide naturellement chaque utilisateur." },
  { icon: Calculator, title: "Calcul automatique", desc: "Les moyennes sont calculées en temps réel, sans saisie manuelle ni risque d'erreur." },
  { icon: FileText, title: "Bulletins automatisés", desc: "Génération des bulletins scolaires en quelques clics, prêts à être imprimés." },
  { icon: Shield, title: "Données sécurisées", desc: "Les informations des élèves et de l'établissement sont protégées et confidentielles." },
  { icon: Smartphone, title: "Accessible partout", desc: "NoteFlow fonctionne sur ordinateur, tablette et mobile, depuis n'importe où." },
];

function WhyNoteFlow() {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Avantages</p>
            <h2 className="text-3xl font-bold text-slate-900">Pourquoi choisir NoteFlow ?</h2>
          </div>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={i * 60}>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center mb-4 transition-colors">
                    <Icon size={20} className="text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// How it works
const STEPS = [
  { n: "01", title: "Configuration de l'établissement", desc: "Renseignez les informations de votre établissement et paramétrez les trimestres." },
  { n: "02", title: "Importation des données", desc: "Importez ou ajoutez vos enseignants et élèves en quelques minutes." },
  { n: "03", title: "Création des classes et matières", desc: "Organisez vos classes, définissez les matières et les coefficients." },
  { n: "04", title: "Saisie des notes", desc: "Chaque enseignant saisit les notes de ses élèves dans son espace dédié." },
  { n: "05", title: "Consultation des résultats", desc: "Les élèves suivent leurs notes et leur moyenne dès que les notes sont publiées." },
  { n: "06", title: "Génération des bulletins", desc: "L'administrateur génère et distribue les bulletins en quelques clics." },
];

function HowItWorks() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Étapes</p>
            <h2 className="text-3xl font-bold text-slate-900">Comment ça fonctionne ?</h2>
          </div>
        </FadeIn>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-7 top-0 bottom-0 w-px bg-blue-100 hidden sm:block" />
          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <FadeIn key={step.n} delay={i * 80}>
                <div className="flex gap-6 items-start">
                  <div className="relative z-10 shrink-0 w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-200">
                    {step.n}
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-blue-100 hover:shadow-sm transition-all">
                    <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

//CTA 
function CTA() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <div className="bg-blue-600 rounded-3xl px-8 py-14 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-blue-500/40" />
            <div className="absolute -bottom-14 -left-10 w-56 h-56 rounded-full bg-blue-700/40" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Prêt à moderniser la gestion<br className="hidden md:block" /> de votre établissement ?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                Rejoignez NoteFlow et offrez à vos équipes et élèves une expérience scolaire plus fluide.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {/* <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                  Commencer
                </button> */}
                <button className="bg-blue-700/60 hover:bg-blue-700/80 text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-blue-400/30">
                  <a
                    href="https://wa.me/2250566009210?text=Bonjour%20je%20souhaite%20obtenir%20des%20informations%20sur%20NoteFlow."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Nous contacter
                  </a>
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

//Footer
function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <GraduationCap size={18} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">NoteFlow</span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              La plateforme de gestion scolaire conçue pour simplifier le quotidien de tous.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            <div>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">Produit</p>
              <ul className="space-y-2 text-sm">
                {["Fonctionnalités", "Fonctionnement", "Connexion"].map((l) => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">Support</p>
              <ul className="space-y-2 text-sm">
                {["Nous contacter", "Documentation", "Confidentialité"].map((l) => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <span>© {new Date().getFullYear()} NoteFlow. Tous droits réservés.</span>
          <span className="text-slate-600">Conçu avec soin pour les établissements scolaires.</span>
        </div>
      </div>
    </footer>
  );
}

// App
export default function App() {
  const navigate = useNavigate()
  useEffect(()=>{
    const token  = localStorage.getItem('token')
    if(token){
      const decodedToken = jwtDecode(token)
      const role = decodedToken?.user?.user?.role || decodedToken?.user?.role || decodedToken?.role 
      switch (role) {
                case 'ENSEIGNANT':
                    navigate('/dashboard/enseignant');
                    break;

                case 'ELEVE':
                    navigate('/dashboard/eleve');
                    break;

                case 'ADMIN':
                    navigate('/dashboard/admin');
                    break;

                case 'SUPERADMIN':
                case 'SUPER_ADMIN':
                    navigate('/dashboard/super-admin');
                    break;

                default:
                    navigate('/login');
            }
      console.log(decodedToken)
    }
  },[])
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }} className="bg-white text-slate-900 antialiased">
      <Navbar />
      <Hero />
      <Presentation />
      <Users />
      <WhyNoteFlow />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}