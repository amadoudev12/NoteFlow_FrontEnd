import { useState, useRef } from 'react';
// import SignatureCanvas from "react-signature-canvas";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import adminService from '../../services/adminService';

// ── Icons ────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const icons = {
  logo:     "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  user:     ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 7a4 4 0 100 8 4 4 0 000-8z"],
  building: ["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"],
  mail:     ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"],
  lock:     ["M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z","M7 11V7a5 5 0 0110 0v4"],
  phone:    "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.18 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  map:      ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z","M12 7a3 3 0 100 6 3 3 0 000-6z"],
  hash:     "M4 9h16M4 15h16M10 3L8 21M16 3l-2 18",
  eye:      ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 100 6 3 3 0 000-6z"],
  eyeOff:   ["M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94","M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19","M1 1l22 22","M10.73 5.08A10.43 10.43 0 0112 5c7 0 11 8 11 8a18.45 18.45 0 01-2.33 3.26"],
  check:    "M20 6L9 17l-5-5",
  arrow:    "M5 12h14M12 5l7 7-7 7",
  arrowL:   "M19 12H5M12 19l-7-7 7-7",
  loader:   "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
  director: ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 3a4 4 0 100 8 4 4 0 000-8z","M16 3.13a4 4 0 010 7.75"],
  code:     "M10 20l4-16M6.5 9.5L2 12l4.5 2.5M17.5 9.5L22 12l-4.5 2.5",
  status:   ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z","M12 8v4M12 16h.01"],
};

// ── PageLoader ───────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-blue-600">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      <p className="text-sm font-medium tracking-wide text-white/85">Création du compte…</p>
    </div>
  );
}

// ── Input Field ──────────────────────────────────────────────────
function Field({ label, icon, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon d={icon} size={16} className="text-gray-400" />
          </div>
        )}
        {children}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">{error}</p>}
    </div>
  );
}

function Input({ icon, error, ...props }) {
  return (
    <Field label={props.label} icon={icon} error={error}>
      <input
        {...props}
        label={undefined}
        className={`block w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-xl text-sm text-gray-900 placeholder-gray-400 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
      />
    </Field>
  );
}

// ── Step Indicator ───────────────────────────────────────────────
function StepIndicator({ current }) {
  const steps = [
    { n: 1, label: 'Compte admin' },
    { n: 2, label: 'Établissement' },
    { n: 3, label: 'Confirmation' },
    // { n: 4, label: 'Signature' }
  ];
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map(({ n, label }, i) => {
        const done    = n < current;
        const active  = n === current;
        return (
          <div key={n} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                done    ? 'bg-blue-600 text-white shadow-md shadow-blue-200' :
                active  ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md shadow-blue-200' :
                          'bg-gray-100 text-gray-400'
              }`}>
                {done ? <Icon d={icons.check} size={15} className="text-white" /> : n}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${active ? 'text-blue-600' : done ? 'text-gray-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-14 sm:w-11 h-0.5 mx-1 mb-5 transition-all duration-300 ${done ? 'bg-blue-400' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1 : Admin account ───────────────────────────────────────
function Step1({ data, onChange, errors }) {
  // const [showPwd, setShowPwd]     = useState(false);
  // const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Prénom"
          icon={icons.user}
          name="prenom"
          placeholder="Jean"
          value={data.prenom}
          onChange={onChange}
          error={errors.prenom}
        />
        <Input
          label="Nom"
          icon={icons.user}
          name="nom"
          placeholder="Dupont"
          value={data.nom}
          onChange={onChange}
          error={errors.nom}
        />
      </div>

      <Input
        label="Adresse email"
        icon={icons.mail}
        name="email"
        type="email"
        placeholder="admin@etablissement.ci"
        value={data.email}
        onChange={onChange}
        error={errors.email}
      />

      {/* <Field label="Mot de passe" icon={icons.lock} error={errors.mot_passe}>
        <input
          name="mot_passe"
          type={showPwd ? 'text' : 'password'}
          placeholder="••••••••"
          value={data.mot_passe}
          onChange={onChange}
          className={`block w-full pl-10 pr-10 py-3 border rounded-xl text-sm text-gray-900 placeholder-gray-400 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.mot_passe ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
        />
        <button type="button" onClick={() => setShowPwd(!showPwd)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600">
          <Icon d={showPwd ? icons.eyeOff : icons.eye} size={16} />
        </button>
      </Field> */}

      {/* <Field label="Confirmer le mot de passe" icon={icons.lock} error={errors.confirm}>
        <input
          name="confirm"
          type={showConfirm ? 'text' : 'password'}
          placeholder="••••••••"
          value={data.confirm}
          onChange={onChange}
          className={`block w-full pl-10 pr-10 py-3 border rounded-xl text-sm text-gray-900 placeholder-gray-400 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.confirm ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
        />
        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600">
          <Icon d={showConfirm ? icons.eyeOff : icons.eye} size={16} />
        </button>
      </Field> */}

      {/* Password strength */}
      {/* {data.mot_passe && (
        <div>
          <div className="flex gap-1 mb-1">
            {[1,2,3,4].map(i => {
              const strength = data.mot_passe.length >= 12 && /[A-Z]/.test(data.mot_passe) && /[0-9]/.test(data.mot_passe) && /[^a-zA-Z0-9]/.test(data.mot_passe) ? 4
                : data.mot_passe.length >= 8 && /[A-Z]/.test(data.mot_passe) && /[0-9]/.test(data.mot_passe) ? 3
                : data.mot_passe.length >= 6 ? 2 : 1;
              return <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= strength
                  ? strength === 1 ? 'bg-red-400' : strength === 2 ? 'bg-yellow-400' : strength === 3 ? 'bg-blue-400' : 'bg-green-400'
                  : 'bg-gray-100'}`} />;
            })}
          </div>
          <p className="text-xs text-gray-400">
            {data.mot_passe.length < 6 ? 'Trop court' : data.mot_passe.length < 8 ? 'Faible — ajoutez des chiffres' : /[A-Z]/.test(data.mot_passe) && /[0-9]/.test(data.mot_passe) && /[^a-zA-Z0-9]/.test(data.mot_passe) ? '✓ Mot de passe fort' : 'Moyen — ajoutez majuscules et symboles'}
          </p>
        </div>
      )} */}
    </div>
  );
}

// ── Step 2 : Etablissement ───────────────────────────────────────
function Step2({ data, onChange, errors }) {
  const statutOptions = ['PUBLIC', 'PRIVE', 'CONFESSIONNEL', 'INTERNATIONAL'];

  return (
    <div className="space-y-5">
      <Input
        label="Nom de l'établissement"
        icon={icons.building}
        name="nom"
        placeholder="Lycée Classique d'Abidjan"
        value={data.nom}
        onChange={onChange}
        error={errors.nom}
      />

      <Input
        label="Nom du directeur"
        icon={icons.director}
        name="directeur"
        placeholder="M. Kouassi Aimé"
        value={data.directeur}
        onChange={onChange}
        error={errors.directeur}
      />

      <Input
        label="Adresse"
        icon={icons.map}
        name="adresse"
        placeholder="Cocody, Abidjan"
        value={data.adresse}
        onChange={onChange}
        error={errors.adresse}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Téléphone (optionnel)"
          icon={icons.phone}
          name="phone"
          type="tel"
          placeholder="+225 07 00 00 00"
          value={data.phone}
          onChange={onChange}
          error={errors.phone}
        />
        <Input
          label="Email (optionnel)"
          icon={icons.mail}
          name="email"
          type="email"
          placeholder="contact@lycee.ci"
          value={data.email}
          onChange={onChange}
          error={errors.email}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Code établissement"
          icon={icons.code}
          name="code"
          placeholder="LCA-001"
          value={data.code}
          onChange={onChange}
          error={errors.code}
        />

        <Field label="Statut" icon={icons.status} error={errors.statut}>
          <select
            name="statut"
            value={data.statut}
            onChange={onChange}
            className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-gray-900 bg-white transition-all duration-200 appearance-none
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors.statut ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <option value="">Sélectionner…</option>
            {statutOptions.map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );
}

// ── Step 3 : Confirmation summary ────────────────────────────────
function Step3({ admin, etab }) {
  const Row = ({ label, value }) => value ? (
    <div className="flex items-start justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 shrink-0 w-40">{label}</span>
      <span className="text-sm font-medium text-gray-800 text-right">{value}</span>
    </div>
  ) : null;

  return (
    <div className="space-y-5">
      {/* Admin */}
      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon d={icons.user} size={16} className="text-blue-600" />
          </div>
          <h3 className="text-sm font-semibold text-blue-800">Compte administrateur</h3>
        </div>
        <Row label="Prénom" value={admin.prenom} />
        <Row label="Nom" value={admin.nom} />
        <Row label="Email" value={admin.email} />
        {/* <Row label="Mot de passe" value="••••••••" /> */}
      </div>

      {/* Etablissement */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Icon d={icons.building} size={16} className="text-indigo-600" />
          </div>
          <h3 className="text-sm font-semibold text-indigo-800">Informations de l'établissement</h3>
        </div>
        <Row label="Nom" value={etab.nom} />
        <Row label="Directeur" value={etab.directeur} />
        <Row label="Adresse" value={etab.adresse} />
        <Row label="Téléphone" value={etab.phone} />
        <Row label="Email" value={etab.email} />
        <Row label="Code" value={etab.code} />
        <Row label="Statut" value={etab.statut} />
      </div>

      <p className="text-xs text-gray-400 text-center">
        En créant votre compte, vous acceptez les conditions d'utilisation de NoteFlow.
      </p>
    </div>
  );
}


// signature step
// function Step4({ sigRef, onSignatureEnd, onClear, signatureError }) {
//   return (
//     <div className="space-y-5">
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1.5">
//           Signature du directeur *
//         </label>

//         <div className={`relative border-2 rounded-xl bg-white overflow-hidden cursor-crosshair transition-colors
//           ${signatureError ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}`}>
//           <div className="absolute bottom-8 left-4 right-4 border-b border-dashed border-gray-200 pointer-events-none" />
//           <SignatureCanvas
//             ref={sigRef}
//             onEnd={onSignatureEnd}
//             penColor="#1e3a5f"
//             backgroundColor="transparent"
//             canvasProps={{
//               className: "w-full block touch-none",
//               style: { height: 180 },
//             }}
//           />
//           <span className="absolute bottom-2 right-3 text-[10px] text-gray-300 font-bold tracking-widest pointer-events-none select-none uppercase">
//             Signature
//           </span>
//         </div>

//         {signatureError && (
//           <p className="mt-1.5 text-xs text-red-600">{signatureError}</p>
//         )}

//         <div className="flex justify-end mt-1.5">
//           <button
//             type="button"
//             onClick={onClear}
//             className="text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 px-2 py-1 rounded transition-all flex items-center gap-1"
//           >
//             ✕ Effacer et recommencer
//           </button>
//         </div>
//       </div>

//       <p className="text-xs text-gray-400 text-center">
//         En créant votre compte, vous acceptez les conditions d'utilisation de NoteFlow.
//       </p>
//     </div>
//   );
// }
// ── Main Register Page ───────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [adminData, setAdminData] = useState({
    prenom: '', nom: '', email: '',
    // mot_passe: '', confirm: '',
  });
  const [etabData, setEtabData] = useState({
    nom: '', directeur: '', adresse: '', phone: '', email: '', code: '', statut: '',
  });

  const [errorsAdmin, setErrorsAdmin] = useState({});
  const [errorsEtab, setErrorsEtab]   = useState({});

  // const sigRef = useRef(null);
  // const [hasSig, setHasSig]             = useState(false);
  // const [signatureError, setSignatureError] = useState('');

  const onChangeAdmin = (e) => {
    setAdminData(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrorsAdmin(p => ({ ...p, [e.target.name]: '' }));
  };
  const onChangeEtab = (e) => {
    setEtabData(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrorsEtab(p => ({ ...p, [e.target.name]: '' }));
  };

  // Validate step 1
  const validateStep1 = () => {
    const errs = {};
    if (!adminData.prenom.trim())  errs.prenom   = 'Le prénom est requis.';
    if (!adminData.nom.trim())     errs.nom      = 'Le nom est requis.';
    if (!adminData.email.trim())   errs.email    = 'L\'email est requis.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminData.email)) errs.email = 'Email invalide.';
    // if (!adminData.mot_passe)      errs.mot_passe = 'Le mot de passe est requis.';
    // else if (adminData.mot_passe.length < 6) errs.mot_passe = 'Minimum 6 caractères.';
    // if (!adminData.confirm)        errs.confirm  = 'Veuillez confirmer le mot de passe.';
    // else if (adminData.confirm !== adminData.mot_passe) errs.confirm = 'Les mots de passe ne correspondent pas.';
    setErrorsAdmin(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate step 2
  const validateStep2 = () => {
    const errs = {};
    if (!etabData.nom.trim())       errs.nom       = 'Le nom est requis.';
    if (!etabData.directeur.trim()) errs.directeur = 'Le nom du directeur est requis.';
    if (!etabData.adresse.trim())   errs.adresse   = 'L\'adresse est requise.';
    if (!etabData.code.trim())      errs.code      = 'Le code est requis.';
    if (!etabData.statut)           errs.statut    = 'Le statut est requis.';
    setErrorsEtab(errs);
    return Object.keys(errs).length === 0;
  };

  // const onSignatureEnd = () => {
  //   if (sigRef.current && !sigRef.current.isEmpty()) {
  //     setHasSig(true);
  //     setSignatureError('');
  //   }
  // };

  // const clearSignature = () => {
  //   sigRef.current?.clear();
  //   setHasSig(false);
  //   setSignatureError('');
  // };

  // handleNext — dernière étape = confirmation (step 3)
  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(s => s + 1);
  };

  // handleSubmit — version FormData, sans mot de passe ni signature
  const handleSubmit = async () => {
    // if (!sigRef.current || sigRef.current.isEmpty()) {
    //   setSignatureError('Veuillez apposer la signature avant de continuer.');
    //   return;
    // }
    setLoading(true);
    setApiError(null);
    try {
      // const signatureBlob = await new Promise((resolve, reject) => {
      //   sigRef.current.getCanvas().toBlob(
      //     (blob) => (blob ? resolve(blob) : reject(new Error('Conversion échouée'))),
      //     'image/png'
      //   );
      // });

      const formData = new FormData();
      formData.append('prenom',     adminData.prenom);
      formData.append('nom',        adminData.nom);
      formData.append('email',      adminData.email);
      // formData.append('mot_passe',  adminData.mot_passe);
      formData.append('etab_nom',       etabData.nom);
      formData.append('etab_directeur', etabData.directeur);
      formData.append('etab_adresse',   etabData.adresse);
      formData.append('etab_phone',     etabData.phone  || '');
      formData.append('etab_email',     etabData.email  || '');
      formData.append('etab_code',      etabData.code);
      formData.append('etab_statut',    etabData.statut);
      // formData.append('signature',      signatureBlob, 'signature.png');

      await adminService.postAdmin(formData);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const stepTitle = {
    1: { title: 'Créer votre compte', sub: 'Renseignez les informations de l\'administrateur' },
    2: { title: 'Votre établissement', sub: 'Informations sur votre établissement scolaire' },
    3: { title: 'Récapitulatif', sub: 'Vérifiez vos informations avant de valider' },
    // 4: { title: 'Signature',             sub: 'Apposez la signature officielle du directeur' }
  }[step];

  return (
    <>
      {loading && <PageLoader />}

      <div className="min-h-screen flex bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">

        {/* Left panel — desktop only */}
        {/* <div className="hidden lg:flex lg:w-5/12 xl:w-2/5 bg-linear-to-br from-blue-600 to-indigo-700 flex-col justify-between p-12 relative overflow-hidden">
          Decorative
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-900/30 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />

          Logo
          <div className="relative flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon d={icons.logo} size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">NoteFlow</span>
          </div>

          Center text
          <div className="relative space-y-6">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Rejoignez des centaines d'établissements
            </h2>
            <p className="text-blue-200 text-lg leading-relaxed">
              Créez votre espace en quelques minutes et commencez à gérer les notes de vos élèves dès aujourd'hui.
            </p>
            <div className="space-y-3 pt-2">
              {['Création en moins de 5 minutes', 'Accès immédiat après inscription', 'Support dédié aux établissements'].map(t => (
                <div key={t} className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <Icon d={icons.check} size={11} className="text-white" />
                  </div>
                  <span className="text-sm text-blue-100">{t}</span>
                </div>
              ))}
            </div>
          </div>

          Bottom
          <div className="relative">
            <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4 border border-white/20">
              <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Icon d={icons.building} size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">500+ établissements inscrits</p>
                <p className="text-xs text-blue-200">en Côte d'Ivoire et en Afrique de l'Ouest</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Right panel — form */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
          <div className="w-full max-w-lg">

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8 cursor-pointer" onClick={() => navigate('/')}>
              <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <Icon d={icons.logo} size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">NoteFlow</span>
            </div>

            {/* Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <StepIndicator current={step} />

              <div className="mb-7">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{stepTitle.title}</h1>
                <p className="text-sm text-gray-500">{stepTitle.sub}</p>
              </div>

              {/* API error */}
              {apiError && (
                <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {apiError}
                </div>
              )}

              {/* Steps */}
              {step === 1 && <Step1 data={adminData} onChange={onChangeAdmin} errors={errorsAdmin} />}
              {step === 2 && <Step2 data={etabData}  onChange={onChangeEtab}  errors={errorsEtab} />}
              {step === 3 && <Step3 admin={adminData} etab={etabData} />}
              {/* {step === 4 && (
                <Step4
                  sigRef={sigRef}
                  onSignatureEnd={onSignatureEnd}
                  onClear={clearSignature}
                  signatureError={signatureError}
                />
              )} */}
              {/* Navigation */}
              <div className={`flex gap-3 mt-8 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
                {step > 1 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                  >
                    <Icon d={icons.arrowL} size={16} />
                    Retour
                  </button>
                )}
                {step < 3 ? (
                  <button
                    onClick={handleNext}
                    className="group flex items-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 transition-all duration-200 hover:-translate-y-0.5 ml-auto"
                  >
                    Continuer
                    <Icon d={icons.arrow} size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="group flex items-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 transition-all duration-200 hover:-translate-y-0.5 ml-auto"
                  >
                    {loading ? 'Création…' : 'Créer mon établissement'}
                    {!loading && <Icon d={icons.arrow} size={16} className="group-hover:translate-x-0.5 transition-transform" />}
                  </button>
                )}
              </div>
            </div>

            {/* <p className="text-center text-sm text-gray-500 mt-6">
              Déjà inscrit ?{' '}
              <button onClick={() => navigate('/login')} className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                Se connecter
              </button>
            </p> */}
          </div>
        </div>
      </div>
    </>
  );
}