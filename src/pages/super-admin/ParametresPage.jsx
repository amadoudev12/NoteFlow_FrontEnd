import React, { useEffect, useState } from "react";
import { Sparkles, Image as ImageIcon, Palette, Globe, ChevronsUpDown } from "lucide-react";
import { Card, SectionTitle, SettingsRow } from "../../components/super-admin/SharedComponents.jsx";
import parametreService from "../../services/superAdmin/parametreService";

export default function ParametresPage() {
  const [nomPlateforme, setNomPlateforme] = useState("EduSuite Guinée");
  const [fuseau, setFuseau] = useState("GMT (Conakry)");
  const [langue, setLangue] = useState("Français");
  const [couleur, setCouleur] = useState("#2563eb");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await parametreService.getParametres();
        setNomPlateforme(response.data?.nomPlateforme || 'EduSuite Guinée');
        setFuseau(response.data?.fuseau || 'GMT (Conakry)');
        setLangue(response.data?.langue || 'Français');
        setCouleur(response.data?.couleur || '#2563eb');
      } catch (error) {
        console.error('Erreur chargement paramètres', error);
      }
    };
    load();
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-6">
        <Card className="p-6">
          <SectionTitle eyebrow="Identité" title="Configuration générale de la plateforme" />
          <SettingsRow icon={Sparkles} label="Nom de la plateforme" description="Affiché dans la navigation et les emails.">
            <input
              value={nomPlateforme}
              onChange={(e) => setNomPlateforme(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-body outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </SettingsRow>
          <SettingsRow icon={ImageIcon} label="Logo de la plateforme" description="Format PNG ou SVG, fond transparent recommandé.">
            <button className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-lg py-2.5 text-xs font-bold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors font-body">
              <PlusIcon size={14} /> Téléverser un logo
            </button>
          </SettingsRow>
          <SettingsRow icon={Palette} label="Couleur principale" description="Utilisée pour les boutons et accents.">
            <div className="flex items-center gap-3">
              <input type="color" value={couleur} onChange={(e) => setCouleur(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
              <span className="text-sm font-mono text-slate-500">{couleur}</span>
            </div>
          </SettingsRow>
          <SettingsRow icon={Globe} label="Fuseau horaire" description="Utilisé pour toutes les dates système.">
            <select
              value={fuseau}
              onChange={(e) => setFuseau(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-body outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            >
              <option>GMT (Conakry)</option>
              <option>GMT+1 (Dakar)</option>
              <option>GMT+0 (Londres)</option>
            </select>
          </SettingsRow>
          <SettingsRow icon={ChevronsUpDown} label="Langue par défaut" description="Langue utilisée sur toute la plateforme.">
            <select
              value={langue}
              onChange={(e) => setLangue(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-body outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            >
              <option>Français</option>
              <option>Anglais</option>
            </select>
          </SettingsRow>
        </Card>
        <div className="flex justify-end">
          <button
            onClick={async () => {
              try {
                await parametreService.updateParametres({ nomPlateforme, fuseau, langue, couleur });
              } catch (error) {
                console.error('Erreur enregistrement paramètres', error);
              }
            }}
            className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-bold font-body px-6 py-2.5 rounded-xl shadow-md shadow-blue-600/25 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>

      <Card className="p-6 h-fit">
        <SectionTitle eyebrow="Aperçu" title="Prévisualisation" />
        <div className="rounded-xl border border-slate-100 p-5 bg-slate-50/60">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-display font-bold text-xs" style={{ backgroundColor: couleur }}>
              {nomPlateforme.slice(0, 2).toUpperCase()}
            </div>
            <p className="font-display font-bold text-sm text-slate-800">{nomPlateforme}</p>
          </div>
          <button className="w-full text-white text-xs font-bold font-body py-2 rounded-lg" style={{ backgroundColor: couleur }}>
            Bouton d'action
          </button>
          <p className="text-[11px] text-slate-400 font-body mt-4">{fuseau} · {langue}</p>
        </div>
      </Card>
    </div>
  );
}

function PlusIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
