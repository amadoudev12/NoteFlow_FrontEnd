import {
  Building2,
  UserPlus,
  CalendarCheck2,
  BookPlus,
  Ban,
  UserCheck,
  LayoutDashboard,
  Users,
  CalendarRange,
  BookOpen,
  BarChart3,
  ScrollText,
  Settings,
} from "lucide-react";

const VILLES = ["Conakry", "Labé", "Kankan", "Kindia", "Nzérékoré", "Boké", "Mamou", "Faranah", "Kissidougou", "Siguiri"];
const TYPES_ETAB = ["Public", "Privé", "Professionnel", "Université"];
const PRENOMS = ["Mamadou", "Aïssatou", "Ibrahima", "Fatoumata", "Ousmane", "Mariama", "Alpha", "Kadiatou", "Thierno", "Hadja", "Sékou", "Djénabou"];
const NOMS = ["Diallo", "Barry", "Camara", "Bah", "Sow", "Baldé", "Condé", "Touré", "Keïta", "Sylla"];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fullName() {
  return `${rand(PRENOMS)} ${rand(NOMS)}`;
}

const ETABLISSEMENTS = Array.from({ length: 15 }).map((_, i) => {
  const type = rand(TYPES_ETAB);
  const nomsBase = {
    Public: ["Groupe Scolaire", "Lycée", "Collège"],
    Privé: ["Complexe Scolaire", "Institut", "École Privée"],
    Professionnel: ["Centre de Formation", "Institut Technique"],
    Université: ["Université", "Institut Universitaire"],
  };
  const ville = rand(VILLES);
  const suffixes = ["La Réussite", "Les Flamboyants", "El Hadj Omar", "Sainte Marie", "Excellence", "Horizon", "Nouvel Espoir", "Étoile du Fouta", "Wassa", "Les Palmiers"];
  const nom = `${rand(nomsBase[type])} ${rand(suffixes)}`;
  const statut = Math.random() > 0.15 ? "actif" : "suspendu";
  return {
    id: i + 1,
    nom,
    ville,
    type,
    directeur: fullName(),
    dateCreation: `${randInt(1, 28)}/${String(randInt(1, 12)).padStart(2, "0")}/2026`,
    statut,
    eleves: randInt(120, 2400),
  };
});

const DIRECTEURS = Array.from({ length: 10 }).map((_, i) => {
  const nom = fullName();
  const initials = nom.split(" ").map((n) => n[0]).join("");
  return {
    id: i + 1,
    nom,
    initials,
    email: `${nom.toLowerCase().replace(" ", ".")}@ecole-gn.com`,
    telephone: `+224 6${randInt(20, 99)} ${randInt(10, 99)} ${randInt(10, 99)} ${randInt(10, 99)}`,
    etablissement: ETABLISSEMENTS[i % ETABLISSEMENTS.length].nom,
    statut: Math.random() > 0.1 ? "actif" : "inactif",
  };
});

const ANNEES_ACADEMIQUES = [
  { id: 1, libelle: "2023-2024", statut: "archivee", etablissements: 96, debut: "01/10/2023", fin: "30/06/2024" },
  { id: 2, libelle: "2024-2025", statut: "archivee", etablissements: 110, debut: "01/10/2024", fin: "30/06/2025" },
  { id: 3, libelle: "2025-2026", statut: "archivee", etablissements: 121, debut: "01/10/2025", fin: "30/06/2026" },
  { id: 4, libelle: "2026-2027", statut: "active", etablissements: 128, debut: "01/10/2026", fin: "30/06/2027" },
];

const TRIMESTRES = [
  { id: 1, nom: "Trimestre 1", debut: "01/10/2026", fin: "20/12/2026", progression: 100, statut: "termine" },
  { id: 2, nom: "Trimestre 2", debut: "05/01/2027", fin: "28/03/2027", progression: 62, statut: "en cours" },
  { id: 3, nom: "Trimestre 3", debut: "05/04/2027", fin: "30/06/2027", progression: 0, statut: "a venir" },
];

const CROISSANCE_DATA = [
  { mois: "Jan", etablissements: 96 },
  { mois: "Fév", etablissements: 99 },
  { mois: "Mar", etablissements: 101 },
  { mois: "Avr", etablissements: 104 },
  { mois: "Mai", etablissements: 108 },
  { mois: "Juin", etablissements: 110 },
  { mois: "Juil", etablissements: 112 },
  { mois: "Août", etablissements: 116 },
  { mois: "Sep", etablissements: 119 },
  { mois: "Oct", etablissements: 122 },
  { mois: "Nov", etablissements: 125 },
  { mois: "Déc", etablissements: 128 },
];

const REPARTITION_DATA = [
  { name: "Public", value: 52, color: "#2563eb" },
  { name: "Privé", value: 41, color: "#16a34a" },
  { name: "Professionnel", value: 22, color: "#f97316" },
  { name: "Université", value: 13, color: "#94a3b8" },
];

const ACTIVITE_HEBDO = [
  { jour: "Lun", connexions: 240 },
  { jour: "Mar", connexions: 310 },
  { jour: "Mer", connexions: 280 },
  { jour: "Jeu", connexions: 360 },
  { jour: "Ven", connexions: 400 },
  { jour: "Sam", connexions: 190 },
  { jour: "Dim", connexions: 120 },
];

const ACTIVITIES = [
  { id: 1, type: "etablissement", texte: "Établissement « Lycée Les Flamboyants » créé à Kindia", temps: "Il y a 12 min", icon: Building2, color: "blue" },
  { id: 2, type: "directeur", texte: "Directeur Mamadou Diallo ajouté au Complexe Scolaire Excellence", temps: "Il y a 48 min", icon: UserPlus, color: "green" },
  { id: 3, type: "annee", texte: "Année académique 2026-2027 activée sur la plateforme", temps: "Il y a 3 h", icon: CalendarCheck2, color: "orange" },
  { id: 4, type: "trimestre", texte: "Trimestre 2 créé pour l'année 2026-2027", temps: "Il y a 5 h", icon: BookPlus, color: "blue" },
  { id: 5, type: "etablissement", texte: "Établissement « Institut Wassa » suspendu pour non-paiement", temps: "Hier, 18:22", icon: Ban, color: "red" },
  { id: 6, type: "directeur", texte: "Fatoumata Barry a mis à jour son profil directeur", temps: "Hier, 14:05", icon: UserCheck, color: "green" },
];

const LOGS = [
  { id: 1, action: "Connexion Super Admin", utilisateur: "Diallo El Hadj Amadou", date: "07/08/2026 09:14", statut: "succes" },
  { id: 2, action: "Création établissement", utilisateur: "Diallo El Hadj Amadou", date: "07/08/2026 09:20", statut: "succes" },
  { id: 3, action: "Suspension établissement", utilisateur: "Diallo El Hadj Amadou", date: "06/08/2026 18:22", statut: "alerte" },
  { id: 4, action: "Tentative de connexion échouée", utilisateur: "inconnu@mail.com", date: "06/08/2026 22:41", statut: "echec" },
  { id: 5, action: "Activation année académique", utilisateur: "Diallo El Hadj Amadou", date: "05/08/2026 10:02", statut: "succes" },
  { id: 6, action: "Modification paramètres plateforme", utilisateur: "Diallo El Hadj Amadou", date: "04/08/2026 16:47", statut: "succes" },
];

const NAV_ITEMS = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "etablissements", label: "Établissements", icon: Building2 },
  { key: "directeurs", label: "Directeurs", icon: Users },
  { key: "annees", label: "Années académiques", icon: CalendarRange },
  { key: "trimestres", label: "Trimestres", icon: BookOpen },
  { key: "statistiques", label: "Statistiques", icon: BarChart3 },
  { key: "logs", label: "Journaux système", icon: ScrollText },
  { key: "parametres", label: "Paramètres", icon: Settings },
];

export {
  ETABLISSEMENTS,
  DIRECTEURS,
  ANNEES_ACADEMIQUES,
  TRIMESTRES,
  CROISSANCE_DATA,
  REPARTITION_DATA,
  ACTIVITE_HEBDO,
  ACTIVITIES,
  LOGS,
  NAV_ITEMS,
  TYPES_ETAB,
};
