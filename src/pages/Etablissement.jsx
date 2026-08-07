import { Building2, Check, GraduationCap,  Phone, Mail, MapPin,  Hash, BadgeCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionTitle } from "./Admin";
import etablissementService from "../../services/etablissementService";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast"
export default function EtablissementPage() {
    const [id, setId] = useState(null)
    useEffect(()=>{
        const token = localStorage.getItem('token')
        if (!token) {
            toast.error("Veuillez vous reconnecter pour continuer")
            return
        }
        const decoded = jwtDecode(token)
        setId(decoded?.profil?.id ?? null)
    },[])
    const [etablissement, setEtablissement] = useState(null)
    useEffect(()=>{
        if(!id) return
        const getEtablissement = async () => {
            try {
                const res = await etablissementService.getEtablissement(id)
                if (res.data){
                    setEtablissement(res.data.etablissement)
                }
            }catch(err){
                console.log('erreur serveur')
            }
        }
        getEtablissement()
    },[id])
    const [form, setForm] = useState({
        nom:  "",
        adresse: "",
        phone: "",
        email: "",
        code :  "",
        statut:  "",
        directeur: "",
        admin_id: ""
    });
    useEffect(() => {
        if (etablissement) {
            setForm({
                nom: etablissement.nom || "",
                adresse: etablissement.adresse || "",
                phone: etablissement.phone || "",
                email: etablissement.email || "",
                code: etablissement.code || "",
                statut: etablissement.statut || "",
                directeur: etablissement.directeur || "",
                admin_id: etablissement.admin_id || ""
            })
        }
    }, [etablissement])
    const [saved, setSaved] = useState(false)
    const handleSave = async () => {
        if (!form || !id) {
            toast.error("Veuillez vous reconnecter avant de sauvegarder")
            return
        }
        try {
            const payload = {
                ...form,
                admin_id: id,
                phone: form.phone || ""
            }
            const res = await etablissementService.postEtablissement(payload)
            if (res?.status === 201) {
                toast.success("Informations sauvegardées avec succès")
            }
        }catch(err){
            console.error(err)
            toast.error("Échec de l'enregistrement. Vérifiez les informations saisies.")
        }
    };

    const fields = [
        { key: "nom", label: "Nom de l'établissement", icon: Building2, placeholder: "Nom officiel" },
        { key: "adresse", label: "Adresse", icon: MapPin, placeholder: "Adresse complète" },
        { key: "phone", label: "Téléphone", icon: Phone, placeholder: "+225 XX XX XX XX" },
        { key: "email", label: "Email", icon: Mail, placeholder: "email@etablissement.ci" },
        { key: "code", label: "Code établissement", icon: Hash, placeholder: "00025" },
        { key: "statut", label: "Statut", icon: BadgeCheck, placeholder: "Privé / Public" },
        { key: "directeur", label: "Directeur", icon: User, placeholder: "Nom du directeur" }
    ];

    return (
        <div className="ml-45 max-sm:ml-2 max-lg:ml-8">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        <SectionTitle icon={Building2} title="Établissement" subtitle="Informations et configuration de l'école" />
        <div className="max-w-2xl">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            {/* <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white mb-6 shadow-lg">
                <GraduationCap size={36} />
            </div> */}
            <div className="space-y-5">
                {fields.map(f => (
                <div key={f.key}>
                    <label className="text-sm font-medium text-slate-600 mb-1.5  flex items-center gap-2">
                    <f.icon size={14} className="text-blue-400" /> {f.label}
                    </label>
                    <input
                    type="text"
                    value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    />
                </div>
                ))}
                <button
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 mt-4"
                >
                <Check size={16} /> Sauvegarder les modifications
                </button>
                {/* {saved && (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 rounded-xl px-4 py-3 text-sm">
                    <Check size={16} /> Informations sauvegardées avec succès !
                </div>
                )} */}
            </div>
            </div>
        </div>
        </div>
    );
    }